"use client";

import { FormEvent, useEffect, useState } from "react";

type StaffUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  active: boolean;
};

export default function AdminStaffPage() {
  const [users, setUsers] = useState<StaffUser[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/admin/staff");
    const data = await res.json();
    setUsers(data.users || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function create(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/admin/staff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role: "staff" }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Erreur");
      return;
    }
    setName("");
    setEmail("");
    setPassword("");
    load();
  }

  async function toggle(u: StaffUser) {
    await fetch("/api/admin/staff", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: u.id, active: !u.active }),
    });
    load();
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-[var(--primary)]">Équipe</h1>
      <p className="mt-1 text-[var(--espresso)]/60">
        Comptes caisse et propriétaire.
      </p>

      <form
        onSubmit={create}
        className="mt-8 grid gap-3 rounded-2xl bg-white p-5 shadow-sm sm:grid-cols-2"
      >
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nom"
          className="rounded-xl border border-[var(--primary)]/15 px-4 py-3"
        />
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="rounded-xl border border-[var(--primary)]/15 px-4 py-3"
        />
        <input
          required
          type="password"
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mot de passe (min. 6)"
          className="rounded-xl border border-[var(--primary)]/15 px-4 py-3"
        />
        <button
          type="submit"
          className="rounded-xl bg-[var(--primary)] px-5 py-3 text-[#F7F0E8]"
        >
          Ajouter un serveur
        </button>
        {error && <p className="text-sm text-red-700 sm:col-span-2">{error}</p>}
      </form>

      <ul className="mt-6 divide-y divide-[var(--primary)]/8 overflow-hidden rounded-2xl bg-white shadow-sm">
        {users.map((u) => (
          <li
            key={u.id}
            className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
          >
            <div>
              <p className="font-medium text-[var(--primary)]">
                {u.name}
                <span className="ml-2 rounded-full bg-[#EFE4D6] px-2 py-0.5 text-xs">
                  {u.role}
                </span>
              </p>
              <p className="text-sm text-[var(--espresso)]/55">
                {u.email} · {u.active ? "Actif" : "Révoqué"}
              </p>
            </div>
            {u.role !== "owner" && (
              <button
                type="button"
                onClick={() => toggle(u)}
                className="rounded-full bg-[#EFE4D6] px-3 py-1.5 text-sm"
              >
                {u.active ? "Révoquer" : "Réactiver"}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
