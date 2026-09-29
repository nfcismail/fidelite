import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth";

const schema = z.object({
  cardId: z.string().min(3),
  amount: z.number().int().min(1).max(20).default(1),
});

export async function POST(req: Request) {
  const session = await requireSession(["owner", "staff"]);
  if (!session) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  try {
    const body = schema.parse(await req.json());
    const customer = await prisma.customer.findUnique({
      where: { cardId: body.cardId.toUpperCase() },
    });
    if (!customer) {
      return NextResponse.json({ error: "Client introuvable" }, { status: 404 });
    }

    const updated = await prisma.$transaction(async (tx) => {
      const c = await tx.customer.update({
        where: { id: customer.id },
        data: { stamps: { increment: body.amount } },
      });
      await tx.transaction.create({
        data: {
          customerId: customer.id,
          type: "earn",
          amount: body.amount,
          staffId: session.id,
          note: `+${body.amount} tampon(s)`,
        },
      });
      return c;
    });

    return NextResponse.json({
      ok: true,
      stamps: updated.stamps,
      customer: {
        id: updated.id,
        name: updated.name,
        phone: updated.phone,
        cardId: updated.cardId,
        stamps: updated.stamps,
      },
    });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
