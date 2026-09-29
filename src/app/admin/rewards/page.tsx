"use client";

import { FormEvent, useEffect, useState } from "react";

type Reward = {
  id: string;
  title: string;
  stampsRequired: number;
  active: boolean;
  sortOrder: number;
};

export default function AdminRewardsPage() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [title, setTitle] = useState("");
  const [stampsRequired, setStampsRequired] = useState(10);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/admin/rewards");
    const data = await res.json();
    setRewards(data.rewards || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function create(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/admin/rewards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, stampsRequired }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Erreur");
      return;
    }
    setTitle("");
    setStampsRequired(10);
    load();
  }

  async function toggle(r: Reward) {
    await fetch("/api/admin/rewards", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: r.id, active: !r.active }),
    });
    load();
  }

  async function remove(id: string) {
    if (!confirm("Supprimer cette récompense ?")) return;
    await fetch(`/api/admin/rewards?id=${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-[var(--primary)]">Récompenses</h1>
      <p className="mt-1 text-[var(--espresso)]/60">
        Définissez le nombre de tampons pour chaque cadeau.
      </p>

      <form
        onSubmit={create}
        className="mt-8 grid gap-3 rounded-2xl bg-white p-5 shadow-sm sm:grid-cols-[1fr_120px_auto]"
      >
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titre (ex. Café offert)"
          className="rounded-xl border border-[var(--primary)]/15 px-4 py-3"
        />
        <input
          type="number"
          min={1}
          required
          value={stampsRequired}
          onChange={(e) => setStampsRequired(Number(e.target.value))}
          className="rounded-xl border border-[var(--primary)]/15 px-4 py-3"
        />
        <button
          type="submit"
          className="rounded-xl bg-[var(--primary)] px-5 py-3 text-[#F7F0E8]"
        >
          Ajouter
        </button>
        {error && <p className="text-sm text-red-700 sm:col-span-3">{error}</p>}
      </form>

      <ul className="mt-6 divide-y divide-[var(--primary)]/8 overflow-hidden rounded-2xl bg-white shadow-sm">
        {rewards.map((r) => (
          <li
            key={r.id}
            className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
          >
            <div>
              <p className="font-medium text-[var(--primary)]">{r.title}</p>
              <p className="text-sm text-[var(--espresso)]/55">
                {r.stampsRequired} tampons · {r.active ? "Active" : "Inactive"}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => toggle(r)}
                className="rounded-full bg-[#EFE4D6] px-3 py-1.5 text-sm"
              >
                {r.active ? "Désactiver" : "Activer"}
              </button>
              <button
                type="button"
                onClick={() => remove(r.id)}
                className="rounded-full px-3 py-1.5 text-sm text-red-700"
              >
                Supprimer
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
