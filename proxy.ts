import { NextResponse, type NextRequest } from "next/server";
import { COOKIE, sessionValid } from "@/lib/auth";

// Private by default. /api/agent/* checks its own bearer token.
const PUBLIC = new Set(["/login", "/api/login", "/api/health", "/manifest.webmanifest", "/sw.js"]);

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (PUBLIC.has(pathname) || pathname.startsWith("/icons/") || pathname.startsWith("/api/agent/")) {
    return NextResponse.next();
  }
  if (sessionValid(req.cookies.get(COOKIE)?.value)) return NextResponse.next();
  if (pathname.startsWith("/api/")) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  return NextResponse.redirect(new URL("/login", req.url));
}

export const config = { matcher: ["/((?!_next/).*)"] };
