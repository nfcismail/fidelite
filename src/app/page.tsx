import Link from "next/link";
import { getSettings } from "@/lib/utils";
import { prisma } from "@/lib/db";

export default async function HomePage() {
  const settings = await getSettings();
  const rewards = await prisma.reward.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="min-h-screen overflow-x-hidden bg-[var(--foam)]">
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 10% 0%, color-mix(in srgb, var(--accent) 28%, transparent), transparent 55%),
            radial-gradient(ellipse 60% 40% at 90% 20%, color-mix(in srgb, var(--primary) 18%, transparent), transparent 50%),
            linear-gradient(180deg, #F7F0E8 0%, #EFE4D6 45%, #E8D9C8 100%)
          `,
        }}
      />

      <header className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5">
        <span className="font-display text-xl font-semibold tracking-tight text-[var(--primary)]">
          {settings.brandName}
        </span>
        <div className="flex items-center gap-3 text-sm">
          <Link href="/join" className="hidden text-[var(--espresso)]/70 sm:inline">
            Rejoindre
          </Link>
          <Link
            href="/login"
            className="rounded-full bg-[var(--primary)] px-4 py-2 text-[#F7F0E8]"
          >
            Connexion
          </Link>
        </div>
      </header>

      <main>
        <section className="relative mx-auto grid min-h-[78vh] max-w-5xl items-end gap-10 px-5 pb-16 pt-8 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div className="animate-rise">
            <p className="mb-3 text-sm uppercase tracking-[0.22em] text-[var(--accent)]">
              Programme fidélité · Agadir
            </p>
            <h1 className="font-display text-5xl leading-[1.05] text-[var(--primary)] sm:text-6xl md:text-7xl">
              {settings.brandName}
            </h1>
            <p className="mt-5 max-w-md text-lg text-[var(--espresso)]/75">
              {settings.welcomeText} Un tampon par café. Une récompense qui
              régale.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/join"
                className="rounded-full bg-[var(--accent)] px-6 py-3 font-semibold text-[#F7F0E8] shadow-[0_12px_30px_-12px_var(--accent)] transition hover:brightness-105"
              >
                Obtenir ma carte
              </Link>
              <a
                href={settings.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-[var(--primary)]/20 bg-white/50 px-6 py-3 text-[var(--primary)] backdrop-blur"
              >
                Nous trouver
              </a>
            </div>
          </div>

          <div className="animate-rise-delay relative">
            <div
              className="absolute -inset-6 -z-10 rounded-[2rem] opacity-60 blur-2xl"
              style={{
                background:
                  "linear-gradient(135deg, color-mix(in srgb, var(--accent) 45%, transparent), transparent)",
              }}
            />
            <div className="overflow-hidden rounded-[1.75rem] border border-[var(--primary)]/10 bg-[var(--primary)] text-[#F7F0E8] shadow-2xl">
              <div
                className="h-44 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "linear-gradient(180deg, transparent 20%, #2a160c 100%), radial-gradient(circle at 30% 40%, #C47A3A 0%, transparent 45%), radial-gradient(circle at 70% 30%, #8B5A2B 0%, #2a160c 60%)",
                }}
              />
              <div className="space-y-3 p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-[#F7F0E8]/55">
                  Carte digitale
                </p>
                <p className="font-display text-3xl">{settings.brandName}</p>
                <p className="text-sm text-[#F7F0E8]/70">{settings.tagline}</p>
                <div className="flex gap-1.5 pt-2">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <span
                      key={i}
                      className={`h-3 w-3 rounded-full ${
                        i < 7 ? "bg-[var(--accent)]" : "bg-white/15"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-[#F7F0E8]/50">7 / 10 tampons</p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-[var(--primary)]/8 bg-white/35 py-20 backdrop-blur-sm">
          <div className="mx-auto max-w-5xl px-5">
            <h2 className="font-display text-3xl text-[var(--primary)] sm:text-4xl">
              Comment ça marche
            </h2>
            <p className="mt-3 max-w-xl text-[var(--espresso)]/70">
              Pas d&apos;appli à installer. Une carte web, un scan en caisse.
            </p>
            <ol className="mt-12 grid gap-10 sm:grid-cols-3">
              {[
                {
                  n: "01",
                  t: "Approchez votre téléphone",
                  d: "Scannez la carte NFC ou le QR en salle. Inscription en quelques secondes.",
                },
                {
                  n: "02",
                  t: "Gagnez un tampon",
                  d: "À chaque café, l’équipe scanne votre carte digitale et ajoute un point.",
                },
                {
                  n: "03",
                  t: "Échangez votre récompense",
                  d: "Assez de tampons ? Profitez d’un café offert ou d’une pâtisserie.",
                },
              ].map((step) => (
                <li key={step.n}>
                  <p className="font-display text-4xl text-[var(--accent)]/80">
                    {step.n}
                  </p>
                  <h3 className="mt-3 font-display text-xl text-[var(--primary)]">
                    {step.t}
                  </h3>
                  <p className="mt-2 text-[var(--espresso)]/70">{step.d}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-5xl px-5">
            <h2 className="font-display text-3xl text-[var(--primary)] sm:text-4xl">
              Récompenses
            </h2>
            <p className="mt-3 text-[var(--espresso)]/70">
              Collectez. Échangez. Revenez.
            </p>
            <ul className="mt-10 grid gap-4 sm:grid-cols-2">
              {rewards.map((r) => (
                <li
                  key={r.id}
                  className="flex items-center justify-between gap-4 border-b border-[var(--primary)]/10 py-5"
                >
                  <div>
                    <p className="font-display text-2xl text-[var(--primary)]">
                      {r.title}
                    </p>
                    <p className="text-sm text-[var(--espresso)]/60">
                      {r.stampsRequired} tampons
                    </p>
                  </div>
                  <span className="rounded-full bg-[var(--primary)] px-3 py-1 text-sm text-[#F7F0E8]">
                    {r.stampsRequired}
                  </span>
                </li>
              ))}
              {rewards.length === 0 && (
                <li className="text-[var(--espresso)]/60">
                  Les récompenses arrivent bientôt.
                </li>
              )}
            </ul>
          </div>
        </section>

        <section className="pb-24">
          <div className="mx-auto max-w-5xl px-5">
            <div className="rounded-[1.75rem] bg-[var(--primary)] px-8 py-12 text-[#F7F0E8] sm:px-12">
              <h2 className="font-display text-3xl sm:text-4xl">
                Passez nous voir
              </h2>
              <p className="mt-3 max-w-md text-[#F7F0E8]/70">
                {settings.address}
                <br />
                {settings.phone}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-[var(--accent)] px-5 py-2.5 font-medium"
                >
                  Instagram
                </a>
                <a
                  href={settings.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-white/25 px-5 py-2.5"
                >
                  Google Maps
                </a>
                <Link
                  href="/join"
                  className="rounded-full border border-white/25 px-5 py-2.5"
                >
                  Rejoindre
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--primary)]/8 py-8 text-center text-sm text-[var(--espresso)]/50">
        © {new Date().getFullYear()} {settings.brandName} · Jet Sakan, Agadir
      </footer>
    </div>
  );
}
