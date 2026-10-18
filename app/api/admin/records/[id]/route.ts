import { NextResponse } from "next/server";
import { deleteRecord, updateRecord } from "@/lib/records-store";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const body = await request.json().catch(() => null); const { id } = await context.params;
  const record = await updateRecord(id, body ?? {});
  return record ? NextResponse.json({ record }) : NextResponse.json({ error: "Data tidak ditemukan." }, { status: 404 });
}
export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params; const deleted = await deleteRecord(id);
  return deleted ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "Data tidak ditemukan." }, { status: 404 });
}
