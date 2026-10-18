import { NextResponse } from "next/server";
import { deleteContent, updateContent, validateContent, type ContentProgram } from "@/lib/content-store";

export async function PATCH(request: Request, context: { params: Promise<{ slug: string }> }) { const { slug } = await context.params; const body = await request.json().catch(() => null) as Partial<ContentProgram> | null; if (!body || !validateContent(body)) return NextResponse.json({ error: "Konten tidak valid." }, { status: 400 }); const program = await updateContent(slug, body); return program ? NextResponse.json({ program }) : NextResponse.json({ error: "Program tidak ditemukan." }, { status: 404 }); }
export async function DELETE(_request: Request, context: { params: Promise<{ slug: string }> }) { const { slug } = await context.params; return await deleteContent(slug) ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "Program tidak ditemukan." }, { status: 404 }); }
