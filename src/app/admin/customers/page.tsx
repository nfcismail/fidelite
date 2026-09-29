"use client";

import { FormEvent, useEffect, useState } from "react";

type Customer = {
  id: string;
  name: string;
  phone: string;
  cardId: string;
  stamps: number;
  createdAt: string;
  transactions: Array<{ id: string; type: string; note: string | null; createdAt: string }>;
};

export default function AdminCustomersPage() {
  const [q, setQ] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selected, setSelected] = useState<Customer | null>(null);
  const [stamps, setStamps] = useState(0);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function load(search = q) {
    setLoading(true);
    const res = await fetch(`/api/admin/customers?q=${encodeURIComponent(search)}`);
    const data = await res.json();
    setCustomers(data.customers || []);
    setLoading(false);
  }

  useEffect(() => {
    load("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function open(c: Customer) {
    setSelected(c);
    setStamps(c.stamps);
    setMsg(null);
  }

  async function saveAdjust(e: FormEvent) {
    e.preventDefault();
    if (!selected) return;
    setLoading(true);
    setMsg(null);
    const res = await fetch("/api/admin/customers", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customerId: selected.id, stamps }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setMsg(data.error || "Erreur");
      return;
    }
    setMsg("Tampons mis à jour");
    setSelected({ ...selected, stamps: data.customer.stamps });
    load();
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-[var(--primary)]">Clients</h1>
      <form
        className="mt-6 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          load(q);
        }}
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher nom, téléphone, carte…"
          className="flex-1 rounded-xl border border-[var(--primary)]/15 bg-white px-4 py-3 outline-none"
        />
        <button
          type="submit"
          className="rounded-xl bg-[var(--primary)] px-4 py-3 text-[#F7F0E8]"
        >
          Chercher
        </button>
      </form>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <ul className="divide-y divide-[var(--primary)]/8 overflow-hidden rounded-2xl bg-white shadow-sm">
          {loading && customers.length === 0 && (
            <li className="px-5 py-6 text-sm text-[var(--espresso)]/50">Chargement…</li>
          )}
          {customers.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => open(c)}
                className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-[#F7F0E8]/60"
              >
                <div>
                  <p className="font-medium text-[var(--primary)]">{c.name}</p>
                  <p className="text-sm text-[var(--espresso)]/50">
                    {c.phone} · {c.cardId}
                  </p>
                </div>
                <span className="font-display text-xl text-[var(--accent)]">
                  {c.stamps}
                </span>
              </button>
            </li>
          ))}
          {!loading && customers.length === 0 && (
            <li className="px-5 py-6 text-sm text-[var(--espresso)]/50">
              Aucun client.
            </li>
          )}
        </ul>

        {selected && (
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="font-display text-2xl text-[var(--primary)]">
              {selected.name}
            </h2>
            <p className="text-sm text-[var(--espresso)]/55">
              {selected.phone}
              <br />
              {selected.cardId}
            </p>
            <form onSubmit={saveAdjust} className="mt-5 space-y-3">
              <label className="block">
                <span className="mb-1 block text-sm">Tampons</span>
                <input
                  type="number"
                  min={0}
                  value={stamps}
                  onChange={(e) => setStamps(Number(e.target.value))}
                  className="w-full rounded-xl border border-[var(--primary)]/15 px-3 py-2"
                />
              </label>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-[var(--accent)] py-2.5 font-medium text-[#F7F0E8]"
              >
                Enregistrer
              </button>
              {msg && <p className="text-sm text-emerald-800">{msg}</p>}
            </form>
            <div className="mt-6">
              <p className="text-sm font-medium text-[var(--espresso)]/55">
                Dernières opérations
              </p>
              <ul className="mt-2 space-y-2 text-sm">
                {selected.transactions.map((t) => (
                  <li key={t.id} className="text-[var(--espresso)]/70">
                    {t.note || t.type} ·{" "}
                    {new Date(t.createdAt).toLocaleString("fr-MA")}
                  </li>
                ))}
              </ul>
            </div>
            <a
              href={`/c/${selected.cardId}`}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-block text-sm text-[var(--accent)]"
            >
              Voir la carte →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
