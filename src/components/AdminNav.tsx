"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AdminNav() {
  const pathname = usePathname();
  const items = [
    { href: "/admin", id: "dashboard", label: "Tableau de bord", exact: true },
    { href: "/admin/customers", id: "customers", label: "Clients" },
    { href: "/admin/rewards", id: "rewards", label: "Récompenses" },
    { href: "/admin/branding", id: "branding", label: "Marque & polices" },
    { href: "/admin/staff", id: "staff", label: "Équipe" },
    { href: "/scan", id: "scan", label: "Caisse" },
  ];

  return (
    <nav className="flex flex-wrap gap-2">
      {items.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);
        return (
          <Link
            key={item.id}
            href={item.href}
            className={`rounded-full px-3 py-1.5 text-sm transition ${
              active
                ? "bg-[var(--primary)] text-[#F7F0E8]"
                : "bg-[#EFE4D6] text-[var(--espresso)] hover:bg-[#E4D5C3]"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
