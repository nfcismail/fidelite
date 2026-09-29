import { prisma } from "@/lib/db";

export default async function AdminDashboardPage() {
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
        take: 10,
        include: {
          customer: { select: { name: true, cardId: true } },
          staff: { select: { name: true } },
        },
      }),
    ]);

  const stats = [
    { label: "Clients", value: customers },
    { label: "Tampons aujourd'hui", value: stampsToday._sum.amount || 0 },
    { label: "Échanges aujourd'hui", value: redemptionsToday },
    { label: "Tampons en circulation", value: stampsTotal._sum.stamps || 0 },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl text-[var(--primary)]">
        Tableau de bord
      </h1>
      <p className="mt-1 text-[var(--espresso)]/60">Activité Moka Joy</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-[var(--espresso)]/55">{s.label}</p>
            <p className="mt-2 font-display text-3xl text-[var(--primary)]">
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <section className="mt-10">
        <h2 className="font-display text-xl text-[var(--primary)]">
          Activité récente
        </h2>
        <ul className="mt-4 divide-y divide-[var(--primary)]/8 rounded-2xl bg-white shadow-sm">
          {recent.length === 0 && (
            <li className="px-5 py-6 text-sm text-[var(--espresso)]/50">
              Aucune transaction pour le moment.
            </li>
          )}
          {recent.map((t) => (
            <li key={t.id} className="flex items-center justify-between gap-3 px-5 py-4">
              <div>
                <p className="font-medium text-[var(--primary)]">
                  {t.customer.name}
                  <span className="ml-2 text-xs text-[var(--espresso)]/40">
                    {t.customer.cardId}
                  </span>
                </p>
                <p className="text-sm text-[var(--espresso)]/55">
                  {t.note || t.type}
                  {t.staff ? ` · ${t.staff.name}` : ""}
                </p>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-xs ${
                  t.type === "earn"
                    ? "bg-emerald-50 text-emerald-800"
                    : t.type === "redeem"
                      ? "bg-amber-50 text-amber-900"
                      : "bg-slate-100 text-slate-700"
                }`}
              >
                {t.type === "earn" ? `+${t.amount}` : `−${t.amount}`}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
