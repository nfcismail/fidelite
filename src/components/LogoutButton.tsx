"use client";

import { useState } from "react";

export function LogoutButton({ className }: { className?: string }) {
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      /* still leave the session UI */
    } finally {
      // Hard navigation avoids RSC refresh race on protected /admin|/scan pages
      window.location.assign("/login");
    }
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={loading}
      className={className}
    >
      {loading ? "…" : "Déconnexion"}
    </button>
  );
}
