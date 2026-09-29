import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { getSettings } from "@/lib/utils";
import { CardQr } from "@/components/CardQr";
import { StampGrid } from "@/components/StampGrid";
import { BrandLogo } from "@/components/BrandLogo";

export default async function CustomerCardPage({
  params,
}: {
  params: Promise<{ cardId: string }>;
}) {
  const { cardId } = await params;
  const customer = await prisma.customer.findUnique({
    where: { cardId: cardId.toUpperCase() },
  });
  if (!customer) notFound();

  const settings = await getSettings();
  const rewards = await prisma.reward.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });
  const nextReward =
    rewards.find((r) => r.stampsRequired > customer.stamps) || rewards[0];
  const required = nextReward?.stampsRequired || settings.stampsDefault;

  return (
    <div
      className="min-h-screen px-5 py-10"
      style={{
        background:
          "linear-gradient(180deg, color-mix(in srgb, var(--primary) 8%, #F7F0E8), #F7F0E8)",
      }}
    >
      <div className="mx-auto max-w-md">
        <div className="mb-6 flex items-center justify-between">
          <BrandLogo size="sm" />
          <span className="rounded-full bg-white/70 px-3 py-1 text-xs tracking-wide text-[var(--espresso)]/60">
            {customer.cardId}
          </span>
        </div>

        <div className="overflow-hidden rounded-[1.75rem] bg-[var(--primary)] text-[#F7F0E8] shadow-xl">
          <div
            className="relative flex items-center gap-4 px-6 pb-2 pt-6"
            style={{
              backgroundImage:
                "radial-gradient(circle at 85% 20%, color-mix(in srgb, var(--accent) 35%, transparent), transparent 45%)",
            }}
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#F7F0E8]/12 ring-1 ring-white/20">
              <Image
                src="/moka-joy-logo.png"
                alt=""
                width={48}
                height={48}
                className="rounded-full object-contain"
              />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                Carte fidélité
              </p>
              <h1 className="mt-1 font-display text-3xl">{customer.name}</h1>
              <p className="mt-1 text-sm text-white/60">{settings.tagline}</p>
            </div>
          </div>
          <div className="mx-6 mb-6 mt-4 flex justify-center rounded-2xl bg-[#F7F0E8] p-4">
            <CardQr cardId={customer.cardId} size={200} />
          </div>
          <div className="border-t border-white/10 px-6 py-5">
            <div className="mb-4 flex items-end justify-between">
              <div>
                <p className="text-sm text-white/55">Tampons</p>
                <p className="font-display text-4xl">
                  {customer.stamps}
                  <span className="text-lg text-white/40"> / {required}</span>
                </p>
              </div>
              {nextReward && customer.stamps >= nextReward.stampsRequired && (
                <span className="rounded-full bg-[var(--accent)] px-3 py-1 text-sm text-white">
                  Prêt à échanger
                </span>
              )}
            </div>
            <StampGrid stamps={customer.stamps} required={required} />
          </div>
        </div>

        <section className="mt-8">
          <h2 className="font-display text-xl text-[var(--primary)]">
            Récompenses
          </h2>
          <ul className="mt-4 space-y-3">
            {rewards.map((r) => {
              const ready = customer.stamps >= r.stampsRequired;
              return (
                <li
                  key={r.id}
                  className="flex items-center justify-between rounded-2xl bg-white/60 px-4 py-3"
                >
                  <div>
                    <p className="font-medium text-[var(--primary)]">{r.title}</p>
                    <p className="text-sm text-[var(--espresso)]/55">
                      {r.stampsRequired} tampons
                    </p>
                  </div>
                  <span
                    className={`text-sm ${
                      ready ? "text-[var(--accent)]" : "text-[var(--espresso)]/40"
                    }`}
                  >
                    {ready ? "Disponible" : `${r.stampsRequired - customer.stamps} restants`}
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="mt-6 text-center text-sm text-[var(--espresso)]/50">
            Montrez ce QR en caisse pour gagner ou échanger.
          </p>
        </section>
      </div>
    </div>
  );
}
