import { NextResponse } from "next/server";
import { createContent, listContent, validateContent, type ContentProgram } from "@/lib/content-store";

export async function GET() { return NextResponse.json({ programs: await listContent() }); }
export async function POST(request: Request) { const body = await request.json().catch(() => null) as ContentProgram | null; if (!body || typeof body.slug !== "string" || !/^[a-z0-9-]+$/.test(body.slug) || !validateContent(body)) return NextResponse.json({ error: "Konten tidak valid." }, { status: 400 }); const created = await createContent(body); return created ? NextResponse.json({ program: created }, { status: 201 }) : NextResponse.json({ error: "Slug sudah digunakan." }, { status: 409 }); }
