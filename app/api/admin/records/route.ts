import { NextResponse } from "next/server";
import { addRecord, isValidProgram, listRecords, type RecordStatus } from "@/lib/records-store";

const statuses: RecordStatus[] = ["Baru", "Diverifikasi", "Selesai"];
export async function GET() { return NextResponse.json({ records: await listRecords() }); }
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.name !== "string" || typeof body.email !== "string" || typeof body.program !== "string" || !isValidProgram(body.program) || !statuses.includes(body.status)) return NextResponse.json({ error: "Data tidak valid." }, { status: 400 });
  const record = await addRecord({ name: body.name.trim(), email: body.email.trim(), phone: typeof body.phone === "string" ? body.phone.trim() : "", program: body.program, category: body.category === "Pendataan Ulang" ? body.category : "Pendaftaran Baru", status: body.status, notes: typeof body.notes === "string" ? body.notes.trim() : "" });
  return NextResponse.json({ record }, { status: 201 });
}
