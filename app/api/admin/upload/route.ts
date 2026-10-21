import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSessionCookieName, isValidSessionToken } from "@/lib/admin-auth";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const EXTENSIONS: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif" };

export async function POST(request: Request) {
	const cookieStore = await cookies();
	if (!isValidSessionToken(cookieStore.get(getSessionCookieName())?.value)) {
		return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
	}
	const formData = await request.formData();
	const file = formData.get("file");
	if (!(file instanceof File) || !EXTENSIONS[file.type] || file.size === 0 || file.size > MAX_FILE_SIZE) {
		return NextResponse.json({ error: "File gambar tidak valid atau terlalu besar." }, { status: 400 });
	}
	const filename = `benefit-${Date.now()}-${crypto.randomUUID()}.${EXTENSIONS[file.type]}`;
	const uploadsDir = path.join(process.cwd(), "public", "uploads");
	await mkdir(uploadsDir, { recursive: true });
	await writeFile(path.join(uploadsDir, filename), Buffer.from(await file.arrayBuffer()), { flag: "wx" });
	return NextResponse.json({ path: `/uploads/${filename}` });
}
