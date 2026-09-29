const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

function loadEnvFile() {
  const envPath = path.join(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

function isPostgresUrl(url) {
  if (!url || url === "[SENSITIVE]") return false;
  return (
    url.startsWith("postgresql://") ||
    url.startsWith("postgres://") ||
    url.startsWith("prisma+postgres://")
  );
}

loadEnvFile();

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

if (!url) {
  const sample = (process.env.DATABASE_URL || "").slice(0, 24);
  console.error(
    "No valid Postgres DATABASE_URL found. Got prefix:",
    sample || "(empty)",
    "- Set a postgresql:// URL in Vercel env (or use Neon storage_DATABASE_URL)."
  );
  process.exit(1);
}

process.env.DATABASE_URL = url;
console.log("DB URL protocol OK:", url.split(":")[0] + ":");

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("Usage: node scripts/with-db-url.cjs <command> [args...]");
  process.exit(1);
}

const result = spawnSync(args[0], args.slice(1), {
  stdio: "inherit",
  env: process.env,
  shell: true,
});

process.exit(result.status ?? 1);
