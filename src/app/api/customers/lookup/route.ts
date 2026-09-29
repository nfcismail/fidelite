import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { normalizePhone } from "@/lib/utils";

export async function GET(req: Request) {
  const session = await requireSession(["owner", "staff"]);
  if (!session) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();
  if (!q) {
    return NextResponse.json({ error: "Recherche vide" }, { status: 400 });
  }

  const phone = normalizePhone(q);
  const customer = await prisma.customer.findFirst({
    where: {
      OR: [
        { cardId: q.toUpperCase() },
        { phone },
        { phone: { contains: phone } },
        { name: { contains: q } },
      ],
    },
  });

  if (!customer) {
    return NextResponse.json({ error: "Client introuvable" }, { status: 404 });
  }

  const rewards = await prisma.reward.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json({ customer, rewards });
}
