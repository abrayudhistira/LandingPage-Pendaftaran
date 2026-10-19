import { NextResponse } from "next/server";
import {
	deleteProgram,
	updateProgram,
	validateContent,
	type ContentProgram,
} from "@/lib/program-store";

export async function PATCH(request: Request, context: { params: Promise<{ slug: string }> }) {
	const { slug } = await context.params;
	const body = (await request.json().catch(() => null)) as Partial<ContentProgram> | null;
	if (!body || !validateContent(body)) {
		return NextResponse.json({ error: "Konten tidak valid." }, { status: 400 });
	}
	try {
		const program = await updateProgram(slug, body);
		return program
			? NextResponse.json({ program })
			: NextResponse.json({ error: "Program tidak ditemukan." }, { status: 404 });
	} catch (err) {
		if (err instanceof Error && err.message === "MYSQL_UNAVAILABLE") {
			return NextResponse.json({ error: "Database tidak tersedia." }, { status: 503 });
		}
		throw err;
	}
}

export async function DELETE(_request: Request, context: { params: Promise<{ slug: string }> }) {
	const { slug } = await context.params;
	try {
		const ok = await deleteProgram(slug);
		return ok
			? NextResponse.json({ ok: true })
			: NextResponse.json({ error: "Program tidak ditemukan." }, { status: 404 });
	} catch (err) {
		if (err instanceof Error && err.message === "MYSQL_UNAVAILABLE") {
			return NextResponse.json({ error: "Database tidak tersedia." }, { status: 503 });
		}
		throw err;
	}
}
