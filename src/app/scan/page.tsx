"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { QrScanner } from "@/components/QrScanner";
import { LogoutButton } from "@/components/LogoutButton";

type Customer = {
  id: string;
  name: string;
  phone: string;
  cardId: string;
  stamps: number;
};

type Reward = {
  id: string;
  title: string;
  stampsRequired: number;
};

export default function ScanPage() {
  const [query, setQuery] = useState("");
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmEarn, setConfirmEarn] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);

  const lookup = useCallback(async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setError(null);
    setMessage(null);
    setConfirmEarn(false);
    try {
      const res = await fetch(`/api/customers/lookup?q=${encodeURIComponent(q.trim())}`);
      const data = await res.json();
      if (!res.ok) {
        setCustomer(null);
        setError(data.error || "Introuvable");
        return;
      }
      setCustomer(data.customer);
      setRewards(data.rewards || []);
      setCameraOn(false);
    } catch {
      setError("Erreur réseau");
    } finally {
      setLoading(false);
    }
  }, []);

  const onScan = useCallback(
    (value: string) => {
      setQuery(value);
      lookup(value);
    },
    [lookup]
  );

  async function earn() {
    if (!customer) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/earn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardId: customer.cardId, amount: 1 }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erreur");
        return;
      }
      setCustomer(data.customer);
      setMessage(`+1 tampon · total ${data.stamps}`);
      setConfirmEarn(false);
    } catch {
      setError("Erreur réseau");
    } finally {
      setLoading(false);
    }
  }

  async function redeem(rewardId: string) {
    if (!customer) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardId: customer.cardId, rewardId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erreur");
        return;
      }
      setCustomer(data.customer);
      setMessage(`Échangé : ${data.reward}`);
    } catch {
      setError("Erreur réseau");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setCustomer(null);
    setQuery("");
    setError(null);
    setMessage(null);
    setConfirmEarn(false);
    setCameraOn(true);
  }

  return (
    <div className="min-h-screen bg-[#F7F0E8] px-4 py-6">
      <div className="mx-auto max-w-lg">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <p className="font-display text-2xl text-[var(--primary)]">Caisse</p>
            <p className="text-sm text-[var(--espresso)]/55">Scan & tampons</p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Link href="/admin" className="text-[var(--espresso)]/60">
              Admin
            </Link>
            <LogoutButton className="text-[var(--espresso)]/60" />
          </div>
        </header>

        {cameraOn && (
          <div className="mb-4">
            <QrScanner active={cameraOn} onScan={onScan} />
            <button
              type="button"
              onClick={() => setCameraOn(false)}
              className="mt-2 w-full text-sm text-[var(--espresso)]/50"
            >
              Fermer la caméra
            </button>
          </div>
        )}

        {!cameraOn && !customer && (
          <button
            type="button"
            onClick={() => setCameraOn(true)}
            className="mb-4 w-full rounded-xl border border-dashed border-[var(--primary)]/25 py-3 text-sm text-[var(--espresso)]/70"
          >
            Ouvrir la caméra QR
          </button>
        )}

        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            lookup(query);
          }}
        >
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Téléphone ou n° carte"
            className="flex-1 rounded-xl border border-[var(--primary)]/15 bg-white px-4 py-3 outline-none focus:border-[var(--accent)]"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-[var(--primary)] px-4 py-3 font-medium text-[#F7F0E8]"
          >
            OK
          </button>
        </form>

        {error && (
          <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </p>
        )}
        {message && (
          <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            {message}
          </p>
        )}

        {customer && (
          <div className="mt-6 rounded-[1.5rem] bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-2xl text-[var(--primary)]">
                  {customer.name}
                </h2>
                <p className="text-sm text-[var(--espresso)]/55">
                  {customer.phone} · {customer.cardId}
                </p>
              </div>
              <button
                type="button"
                onClick={reset}
                className="text-sm text-[var(--espresso)]/45"
              >
                Nouveau
              </button>
            </div>

            <p className="mt-5 font-display text-5xl text-[var(--accent)]">
              {customer.stamps}
              <span className="ml-2 text-base font-sans text-[var(--espresso)]/45">
                tampons
              </span>
            </p>

            {!confirmEarn ? (
              <button
                type="button"
                disabled={loading}
                onClick={() => setConfirmEarn(true)}
                className="mt-6 w-full rounded-2xl bg-[var(--accent)] py-5 text-xl font-semibold text-[#F7F0E8]"
              >
                +1 tampon
              </button>
            ) : (
              <div className="mt-6 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmEarn(false)}
                  className="rounded-2xl bg-[#EFE4D6] py-4 font-medium"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={earn}
                  className="rounded-2xl bg-[var(--accent)] py-4 font-semibold text-[#F7F0E8]"
                >
                  Confirmer
                </button>
              </div>
            )}

            <div className="mt-8">
              <p className="mb-3 text-sm font-medium text-[var(--espresso)]/60">
                Échanger
              </p>
              <div className="space-y-2">
                {rewards.map((r) => {
                  const ok = customer.stamps >= r.stampsRequired;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      disabled={!ok || loading}
                      onClick={() => redeem(r.id)}
                      className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left ${
                        ok
                          ? "bg-[var(--primary)] text-[#F7F0E8]"
                          : "bg-[#F3EBE1] text-[var(--espresso)]/40"
                      }`}
                    >
                      <span>{r.title}</span>
                      <span className="text-sm">{r.stampsRequired} pts</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
