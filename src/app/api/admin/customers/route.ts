import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await requireSession(["owner"]);
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();

  const customers = await prisma.customer.findMany({
    where: q
      ? {
          OR: [
            { name: { contains: q } },
            { phone: { contains: q } },
            { cardId: { contains: q.toUpperCase() } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      transactions: { orderBy: { createdAt: "desc" }, take: 5 },
    },
  });

  return NextResponse.json({ customers });
}

const adjustSchema = z.object({
  customerId: z.string(),
  stamps: z.number().int().min(0).max(999),
  note: z.string().optional(),
});

export async function PATCH(req: Request) {
  const session = await requireSession(["owner"]);
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  try {
    const body = adjustSchema.parse(await req.json());
    const customer = await prisma.customer.findUnique({
      where: { id: body.customerId },
    });
    if (!customer) {
      return NextResponse.json({ error: "Client introuvable" }, { status: 404 });
    }

    const delta = body.stamps - customer.stamps;
    const updated = await prisma.$transaction(async (tx) => {
      const c = await tx.customer.update({
        where: { id: customer.id },
        data: { stamps: body.stamps },
      });
      if (delta !== 0) {
        await tx.transaction.create({
          data: {
            customerId: customer.id,
            type: "adjust",
            amount: Math.abs(delta),
            staffId: session.id,
            note: body.note || `Ajustement manuel: ${customer.stamps} → ${body.stamps}`,
          },
        });
      }
      return c;
    });

    return NextResponse.json({ customer: updated });
  } catch {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }
}
