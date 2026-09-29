"use client";

import { FormEvent, useEffect, useState } from "react";

const FONTS = [
  "Fraunces",
  "Playfair Display",
  "Libre Baskerville",
  "Cormorant Garamond",
  "Source Sans 3",
  "DM Sans",
  "Nunito Sans",
  "Manrope",
];

type Settings = {
  brandName: string;
  tagline: string;
  welcomeText: string;
  primaryColor: string;
  accentColor: string;
  displayFont: string;
  bodyFont: string;
  logoUrl: string | null;
  address: string;
  phone: string;
  instagramUrl: string;
  mapsUrl: string;
  stampsDefault: number;
};

export default function AdminBrandingPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => setSettings(d.settings));
  }, []);

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setMsg(null);
    setError(null);
    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(data.error || "Erreur");
      return;
    }
    setSettings(data.settings);
    setMsg("Enregistré — rechargez la page pour voir les polices partout.");
  }

  if (!settings) {
    return <p className="text-[var(--espresso)]/50">Chargement…</p>;
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-[var(--primary)]">
        Marque & polices
      </h1>
      <p className="mt-1 text-[var(--espresso)]/60">
        Personnalisez l&apos;apparence de la carte et du site.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <form onSubmit={save} className="space-y-4 rounded-2xl bg-white p-5 shadow-sm">
          <label className="block">
            <span className="mb-1 block text-sm">Nom de la marque</span>
            <input
              value={settings.brandName}
              onChange={(e) =>
                setSettings({ ...settings, brandName: e.target.value })
              }
              className="w-full rounded-xl border border-[var(--primary)]/15 px-4 py-2.5"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm">Slogan</span>
            <input
              value={settings.tagline}
              onChange={(e) =>
                setSettings({ ...settings, tagline: e.target.value })
              }
              className="w-full rounded-xl border border-[var(--primary)]/15 px-4 py-2.5"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm">Texte d&apos;accueil</span>
            <textarea
              value={settings.welcomeText}
              onChange={(e) =>
                setSettings({ ...settings, welcomeText: e.target.value })
              }
              rows={2}
              className="w-full rounded-xl border border-[var(--primary)]/15 px-4 py-2.5"
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-sm">Couleur principale</span>
              <input
                type="color"
                value={settings.primaryColor}
                onChange={(e) =>
                  setSettings({ ...settings, primaryColor: e.target.value })
                }
                className="h-11 w-full cursor-pointer rounded-xl border border-[var(--primary)]/15 bg-white"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm">Couleur accent</span>
              <input
                type="color"
                value={settings.accentColor}
                onChange={(e) =>
                  setSettings({ ...settings, accentColor: e.target.value })
                }
                className="h-11 w-full cursor-pointer rounded-xl border border-[var(--primary)]/15 bg-white"
              />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-sm">Police titres</span>
              <select
                value={settings.displayFont}
                onChange={(e) =>
                  setSettings({ ...settings, displayFont: e.target.value })
                }
                className="w-full rounded-xl border border-[var(--primary)]/15 px-4 py-2.5"
              >
                {FONTS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-sm">Police texte</span>
              <select
                value={settings.bodyFont}
                onChange={(e) =>
                  setSettings({ ...settings, bodyFont: e.target.value })
                }
                className="w-full rounded-xl border border-[var(--primary)]/15 px-4 py-2.5"
              >
                {FONTS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="block">
            <span className="mb-1 block text-sm">URL logo (optionnel)</span>
            <input
              value={settings.logoUrl || ""}
              onChange={(e) =>
                setSettings({ ...settings, logoUrl: e.target.value || null })
              }
              placeholder="https://…"
              className="w-full rounded-xl border border-[var(--primary)]/15 px-4 py-2.5"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm">Adresse</span>
            <input
              value={settings.address}
              onChange={(e) =>
                setSettings({ ...settings, address: e.target.value })
              }
              className="w-full rounded-xl border border-[var(--primary)]/15 px-4 py-2.5"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm">Téléphone</span>
            <input
              value={settings.phone}
              onChange={(e) =>
                setSettings({ ...settings, phone: e.target.value })
              }
              className="w-full rounded-xl border border-[var(--primary)]/15 px-4 py-2.5"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm">Instagram</span>
            <input
              value={settings.instagramUrl}
              onChange={(e) =>
                setSettings({ ...settings, instagramUrl: e.target.value })
              }
              className="w-full rounded-xl border border-[var(--primary)]/15 px-4 py-2.5"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm">Google Maps</span>
            <input
              value={settings.mapsUrl}
              onChange={(e) =>
                setSettings({ ...settings, mapsUrl: e.target.value })
              }
              className="w-full rounded-xl border border-[var(--primary)]/15 px-4 py-2.5"
            />
          </label>
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-full bg-[var(--primary)] py-3 font-semibold text-[#F7F0E8] disabled:opacity-60"
          >
            {saving ? "…" : "Enregistrer"}
          </button>
          {msg && <p className="text-sm text-emerald-800">{msg}</p>}
          {error && <p className="text-sm text-red-700">{error}</p>}
        </form>

        <div>
          <p className="mb-3 text-sm text-[var(--espresso)]/55">Aperçu carte</p>
          <div
            className="overflow-hidden rounded-[1.5rem] text-[#F7F0E8] shadow-xl"
            style={{
              background: settings.primaryColor,
              fontFamily: `"${settings.bodyFont}", system-ui, sans-serif`,
            }}
          >
            <div className="p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                Carte fidélité
              </p>
              <h2
                className="mt-2 text-3xl"
                style={{ fontFamily: `"${settings.displayFont}", Georgia, serif` }}
              >
                {settings.brandName}
              </h2>
              <p className="mt-1 text-sm text-white/65">{settings.tagline}</p>
              <div className="mt-6 flex gap-1.5">
                {Array.from({ length: 10 }).map((_, i) => (
                  <span
                    key={i}
                    className="h-3.5 w-3.5 rounded-full"
                    style={{
                      background:
                        i < 6 ? settings.accentColor : "rgba(255,255,255,0.15)",
                    }}
                  />
                ))}
              </div>
              <p className="mt-3 text-xs text-white/50">6 / 10 tampons</p>
            </div>
          </div>
          <p
            className="mt-6 text-lg"
            style={{ fontFamily: `"${settings.displayFont}", Georgia, serif` }}
          >
            Titre en {settings.displayFont}
          </p>
          <p
            className="mt-1 text-[var(--espresso)]/70"
            style={{ fontFamily: `"${settings.bodyFont}", system-ui, sans-serif` }}
          >
            Corps en {settings.bodyFont}. {settings.welcomeText}
          </p>
        </div>
      </div>
    </div>
  );
}
