"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function JoinForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erreur");
        return;
      }
      router.push(`/c/${data.cardId}`);
    } catch {
      setError("Réseau indisponible");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <Link href="/" className="text-sm text-[var(--espresso)]/60">
        ← Accueil
      </Link>
      <h1 className="mt-6 font-display text-4xl text-[var(--primary)]">
        Rejoindre Moka Joy
      </h1>
      <p className="mt-3 text-[var(--espresso)]/70">
        {params.get("src") === "nfc"
          ? "Carte NFC détectée — créez votre carte digitale."
          : "Quelques secondes pour obtenir votre carte fidélité."}
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-sm text-[var(--espresso)]/70">
            Prénom
          </span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-[var(--primary)]/15 bg-white/70 px-4 py-3 outline-none focus:border-[var(--accent)]"
            placeholder="Sara"
            autoComplete="given-name"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm text-[var(--espresso)]/70">
            Téléphone
          </span>
          <input
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-xl border border-[var(--primary)]/15 bg-white/70 px-4 py-3 outline-none focus:border-[var(--accent)]"
            placeholder="06 XX XX XX XX"
            inputMode="tel"
            autoComplete="tel"
          />
        </label>
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-[var(--accent)] py-3.5 font-semibold text-[#F7F0E8] disabled:opacity-60"
        >
          {loading ? "Création…" : "Créer ma carte"}
        </button>
      </form>
    </div>
  );
}

export default function JoinPage() {
  return (
    <div
      className="flex min-h-screen items-center px-5 py-12"
      style={{
        background:
          "radial-gradient(ellipse at top, color-mix(in srgb, var(--accent) 20%, transparent), transparent 50%), #F7F0E8",
      }}
    >
      <Suspense fallback={<p>Chargement…</p>}>
        <JoinForm />
      </Suspense>
    </div>
  );
}
