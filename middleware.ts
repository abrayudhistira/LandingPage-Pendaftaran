import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "ambarsan_admin_session";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/admin/login") return NextResponse.next();
  if (!request.cookies.get(SESSION_COOKIE)?.value) {
    if (request.nextUrl.pathname.startsWith("/api/admin")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*", "/api/admin/records/:path*", "/api/admin/content/:path*"] };
