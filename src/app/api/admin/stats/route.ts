import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth";

export async function GET() {
  const session = await requireSession(["owner"]);
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const [customers, stampsToday, redemptionsToday, stampsTotal, recent] =
    await Promise.all([
      prisma.customer.count(),
      prisma.transaction.aggregate({
        where: { type: "earn", createdAt: { gte: start } },
        _sum: { amount: true },
      }),
      prisma.transaction.count({
        where: { type: "redeem", createdAt: { gte: start } },
      }),
      prisma.customer.aggregate({ _sum: { stamps: true } }),
      prisma.transaction.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        include: {
          customer: { select: { name: true, cardId: true } },
          staff: { select: { name: true } },
        },
      }),
    ]);

  return NextResponse.json({
    stats: {
      customers,
      stampsToday: stampsToday._sum.amount || 0,
      redemptionsToday,
      stampsTotal: stampsTotal._sum.stamps || 0,
    },
    recent,
  });
}
