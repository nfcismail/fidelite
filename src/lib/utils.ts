import { prisma } from "./db";

export const FONT_PRESETS = [
  { id: "Fraunces", label: "Fraunces", google: "Fraunces:wght@400;600;700" },
  { id: "Playfair Display", label: "Playfair Display", google: "Playfair+Display:wght@400;600;700" },
  { id: "Libre Baskerville", label: "Libre Baskerville", google: "Libre+Baskerville:wght@400;700" },
  { id: "Cormorant Garamond", label: "Cormorant Garamond", google: "Cormorant+Garamond:wght@400;600;700" },
  { id: "Source Sans 3", label: "Source Sans 3", google: "Source+Sans+3:wght@400;500;600;700" },
  { id: "DM Sans", label: "DM Sans", google: "DM+Sans:wght@400;500;600;700" },
  { id: "Nunito Sans", label: "Nunito Sans", google: "Nunito+Sans:wght@400;600;700" },
  { id: "Manrope", label: "Manrope", google: "Manrope:wght@400;600;700" },
] as const;

export function googleFontsUrl(display: string, body: string) {
  const ids = new Set([display, body]);
  const families = FONT_PRESETS.filter((f) => ids.has(f.id)).map((f) => `family=${f.google}`);
  if (families.length === 0) {
    return "https://fonts.googleapis.com/css2?family=Fraunces:wght@400;600;700&family=Source+Sans+3:wght@400;500;600;700&display=swap";
  }
  return `https://fonts.googleapis.com/css2?${families.join("&")}&display=swap`;
}

export async function getSettings() {
  let settings = await prisma.settings.findUnique({ where: { id: 1 } });
  if (!settings) {
    settings = await prisma.settings.create({ data: { id: 1 } });
  }
  return settings;
}

export function generateCardId() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let id = "MJ-";
  for (let i = 0; i < 8; i++) {
    id += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return id;
}

export function normalizePhone(phone: string) {
  return phone.replace(/[\s.-]/g, "").trim();
}
