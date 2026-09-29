import { PrismaClient } from "@prisma/client";

/**
 * Neon / Vercel often injects POSTGRES_URL, POSTGRES_PRISMA_URL, or a custom
 * prefix like STORAGE_URL instead of DATABASE_URL. Prisma's schema requires
 * DATABASE_URL, so normalize before the client boots.
 */
function resolveDatabaseUrl() {
  const url =
    process.env.DATABASE_URL ||
    process.env.storage_DATABASE_URL ||
    process.env.storage_POSTGRES_PRISMA_URL ||
    process.env.storage_POSTGRES_URL ||
    process.env.DATABASE_URL_DATABASE_URL ||
    process.env.DATABASE_URL_POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.POSTGRES_URL ||
    process.env.STORAGE_URL ||
    process.env.NEON_DATABASE_URL;

  if (url && !process.env.DATABASE_URL) {
    process.env.DATABASE_URL = url;
  }

  return process.env.DATABASE_URL;
}

resolveDatabaseUrl();

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: process.env.DATABASE_URL
      ? { db: { url: process.env.DATABASE_URL } }
      : undefined,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
