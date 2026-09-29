import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { getSettings } from "@/lib/utils";

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json({ settings });
}

const schema = z.object({
  brandName: z.string().min(1).max(60).optional(),
  tagline: z.string().max(120).optional(),
  welcomeText: z.string().max(200).optional(),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  displayFont: z.string().min(1).max(60).optional(),
  bodyFont: z.string().min(1).max(60).optional(),
  logoUrl: z.string().url().nullable().optional().or(z.literal("")),
  address: z.string().max(120).optional(),
  phone: z.string().max(30).optional(),
  instagramUrl: z.string().url().optional().or(z.literal("")),
  mapsUrl: z.string().url().optional().or(z.literal("")),
  stampsDefault: z.number().int().min(1).max(100).optional(),
});

export async function PATCH(req: Request) {
  const session = await requireSession(["owner"]);
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }
  try {
    const body = schema.parse(await req.json());
    const data = {
      ...body,
      logoUrl: body.logoUrl === "" ? null : body.logoUrl,
    };
    const settings = await prisma.settings.upsert({
      where: { id: 1 },
      update: data,
      create: { id: 1, ...data },
    });
    return NextResponse.json({ settings });
  } catch {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }
}
