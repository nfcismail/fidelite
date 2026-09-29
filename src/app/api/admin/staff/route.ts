import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { hashPassword, requireSession } from "@/lib/auth";

export async function GET() {
  const session = await requireSession(["owner"]);
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      active: true,
      createdAt: true,
    },
  });
  return NextResponse.json({ users });
}

const createSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(60),
  password: z.string().min(6),
  role: z.enum(["owner", "staff"]).default("staff"),
});

export async function POST(req: Request) {
  const session = await requireSession(["owner"]);
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }
  try {
    const body = createSchema.parse(await req.json());
    const passwordHash = await hashPassword(body.password);
    const user = await prisma.user.create({
      data: {
        email: body.email.toLowerCase(),
        name: body.name,
        passwordHash,
        role: body.role,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        active: true,
      },
    });
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json(
      { error: "Impossible de créer (email déjà utilisé ?)" },
      { status: 400 }
    );
  }
}

const patchSchema = z.object({
  id: z.string(),
  active: z.boolean().optional(),
  name: z.string().min(2).optional(),
  password: z.string().min(6).optional(),
});

export async function PATCH(req: Request) {
  const session = await requireSession(["owner"]);
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }
  try {
    const body = patchSchema.parse(await req.json());
    const data: { active?: boolean; name?: string; passwordHash?: string } = {};
    if (typeof body.active === "boolean") data.active = body.active;
    if (body.name) data.name = body.name;
    if (body.password) data.passwordHash = await hashPassword(body.password);

    const user = await prisma.user.update({
      where: { id: body.id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        active: true,
      },
    });
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }
}
