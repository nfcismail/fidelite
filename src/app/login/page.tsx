"use client";

import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("admin@mokajoy.ma");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erreur");
        return;
      }
      const next = params.get("next") || data.redirect || "/admin";
      router.push(next);
      router.refresh();
    } catch {
      setError("Réseau indisponible");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <Link href="/" className="font-display text-2xl text-[var(--primary)]">
        Moka Joy
      </Link>
      <h1 className="mt-8 font-display text-3xl text-[var(--primary)]">
        Connexion équipe
      </h1>
      <p className="mt-2 text-[var(--espresso)]/65">
        Accès caisse et administration.
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-sm">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-[var(--primary)]/15 bg-white/80 px-4 py-3 outline-none focus:border-[var(--accent)]"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm">Mot de passe</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-[var(--primary)]/15 bg-white/80 px-4 py-3 outline-none focus:border-[var(--accent)]"
          />
        </label>
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-[var(--primary)] py-3.5 font-semibold text-[#F7F0E8] disabled:opacity-60"
        >
          {loading ? "…" : "Se connecter"}
        </button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center bg-[#F7F0E8] px-5 py-12">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
