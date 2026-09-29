import { PrismaClient } from "@prisma/client";

function isPostgresUrl(url: string | undefined): url is string {
  if (!url || url === "[SENSITIVE]") return false;
  return (
    url.startsWith("postgresql://") ||
    url.startsWith("postgres://") ||
    url.startsWith("prisma+postgres://")
  );
}

/**
 * Neon / Vercel often injects prefixed vars (storage_*, DATABASE_URL_*).
 * Prefer any valid Postgres URL; skip sqlite file: URLs left over from local .env.
 */
export function resolveDatabaseUrl() {
  const candidates = [
    process.env.DATABASE_URL,
    process.env.storage_DATABASE_URL,
    process.env.storage_POSTGRES_PRISMA_URL,
    process.env.storage_POSTGRES_URL_NON_POOLING,
    process.env.storage_POSTGRES_URL,
    process.env.DATABASE_URL_DATABASE_URL,
    process.env.DATABASE_URL_POSTGRES_PRISMA_URL,
    process.env.DATABASE_URL_POSTGRES_URL_NON_POOLING,
    process.env.DATABASE_URL_POSTGRES_URL,
    process.env.POSTGRES_PRISMA_URL,
    process.env.POSTGRES_URL_NON_POOLING,
    process.env.POSTGRES_URL,
    process.env.STORAGE_URL,
    process.env.NEON_DATABASE_URL,
  ];

  const url = candidates.find(isPostgresUrl);
  if (url) {
    process.env.DATABASE_URL = url;
  }
  return process.env.DATABASE_URL;
}

resolveDatabaseUrl();

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: isPostgresUrl(process.env.DATABASE_URL)
      ? { db: { url: process.env.DATABASE_URL } }
      : undefined,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
