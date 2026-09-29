import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE = "moka_session";

function secret() {
  return new TextEncoder().encode(
    process.env.AUTH_SECRET || "moka-joy-dev-secret-change-in-production"
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const needsAuth =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/scan") ||
    pathname.startsWith("/api/earn") ||
    pathname.startsWith("/api/redeem") ||
    pathname.startsWith("/api/admin");

  if (!needsAuth) return NextResponse.next();

  const token = request.cookies.get(COOKIE)?.value;
  if (!token) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  try {
    const { payload } = await jwtVerify(token, secret());
    if (pathname.startsWith("/admin") && payload.role !== "owner") {
      const url = request.nextUrl.clone();
      url.pathname = "/scan";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  } catch {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Session invalide" }, { status: 401 });
    }
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ["/admin/:path*", "/scan", "/api/earn", "/api/redeem", "/api/admin/:path*"],
};
