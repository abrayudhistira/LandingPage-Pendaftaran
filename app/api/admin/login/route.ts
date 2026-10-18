import { NextResponse } from "next/server";
import { createSessionToken, getSessionCookieName, SESSION_TTL, verifyCredentials } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.email !== "string" || typeof body.password !== "string" || !verifyCredentials(body.email, body.password)) return NextResponse.json({ error: "Email atau password tidak valid." }, { status: 401 });
  const response = NextResponse.json({ ok: true });
  response.cookies.set(getSessionCookieName(), createSessionToken(), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: SESSION_TTL });
  return response;
}
