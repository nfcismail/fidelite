import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth";

export async function GET() {
  const session = await requireSession(["owner", "staff"]);
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }
  const rewards = await prisma.reward.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json({ rewards });
}

const createSchema = z.object({
  title: z.string().min(2).max(80),
  stampsRequired: z.number().int().min(1).max(100),
  active: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export async function POST(req: Request) {
  const session = await requireSession(["owner"]);
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }
  try {
    const body = createSchema.parse(await req.json());
    const reward = await prisma.reward.create({
      data: {
        title: body.title,
        stampsRequired: body.stampsRequired,
        active: body.active ?? true,
        sortOrder: body.sortOrder ?? 0,
      },
    });
    return NextResponse.json({ reward });
  } catch {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }
}

const updateSchema = createSchema.partial().extend({ id: z.string() });

export async function PATCH(req: Request) {
  const session = await requireSession(["owner"]);
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }
  try {
    const body = updateSchema.parse(await req.json());
    const { id, ...data } = body;
    const reward = await prisma.reward.update({ where: { id }, data });
    return NextResponse.json({ reward });
  } catch {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  const session = await requireSession(["owner"]);
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id manquant" }, { status: 400 });
  await prisma.reward.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
