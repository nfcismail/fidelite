import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth";

const schema = z.object({
  cardId: z.string().min(3),
  rewardId: z.string().min(1),
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

    const reward = await prisma.reward.findUnique({ where: { id: body.rewardId } });
    if (!reward || !reward.active) {
      return NextResponse.json({ error: "Récompense introuvable" }, { status: 404 });
    }
    if (customer.stamps < reward.stampsRequired) {
      return NextResponse.json(
        { error: `Il manque ${reward.stampsRequired - customer.stamps} tampon(s)` },
        { status: 400 }
      );
    }

    const updated = await prisma.$transaction(async (tx) => {
      const c = await tx.customer.update({
        where: { id: customer.id },
        data: { stamps: { decrement: reward.stampsRequired } },
      });
      await tx.transaction.create({
        data: {
          customerId: customer.id,
          type: "redeem",
          amount: reward.stampsRequired,
          staffId: session.id,
          rewardId: reward.id,
          note: `Échange: ${reward.title}`,
        },
      });
      return c;
    });

    return NextResponse.json({
      ok: true,
      stamps: updated.stamps,
      reward: reward.title,
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
