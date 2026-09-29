import { NextResponse } from "next/server";
import { login } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json());
    const session = await login(body.email, body.password);
    if (!session) {
      return NextResponse.json({ error: "Identifiants incorrects" }, { status: 401 });
    }
    return NextResponse.json({
      user: session,
      redirect: session.role === "owner" ? "/admin" : "/scan",
    });
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }
}
