import Link from "next/link";
import { AdminNav } from "@/components/AdminNav";
import { LogoutButton } from "@/components/LogoutButton";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session || session.role !== "owner") {
    redirect("/login?next=/admin");
  }

  const brand = await prisma.settings.findUnique({ where: { id: 1 } });

  return (
    <div className="min-h-screen bg-[#F7F0E8]">
      <header className="border-b border-[var(--primary)]/8 bg-white/50 px-5 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4">
          <div>
            <Link href="/admin" className="font-display text-xl text-[var(--primary)]">
              {brand?.brandName || "Moka Joy"} Admin
            </Link>
            <p className="text-sm text-[var(--espresso)]/50">{session.name}</p>
          </div>
          <LogoutButton className="text-sm text-[var(--espresso)]/55" />
        </div>
        <div className="mx-auto mt-4 max-w-5xl">
          <AdminNav />
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-5 py-8">{children}</main>
    </div>
  );
}
