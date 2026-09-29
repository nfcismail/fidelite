import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { generateCardId, normalizePhone } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2).max(80),
  phone: z.string().min(8).max(20),
});

export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json());
    const phone = normalizePhone(body.phone);

    const existing = await prisma.customer.findUnique({ where: { phone } });
    if (existing) {
      return NextResponse.json({
        cardId: existing.cardId,
        existing: true,
      });
    }

    let cardId = generateCardId();
    for (let i = 0; i < 5; i++) {
      const taken = await prisma.customer.findUnique({ where: { cardId } });
      if (!taken) break;
      cardId = generateCardId();
    }

    const customer = await prisma.customer.create({
      data: {
        name: body.name.trim(),
        phone,
        cardId,
      },
    });

    return NextResponse.json({ cardId: customer.cardId, existing: false });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "Nom ou téléphone invalide" }, { status: 400 });
    }
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
