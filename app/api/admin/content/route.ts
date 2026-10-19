import { NextResponse } from "next/server";
import {
	createProgram,
	listPrograms,
	validateContent,
	type ContentProgram,
} from "@/lib/program-store";

export async function GET() {
	return NextResponse.json({ programs: await listPrograms() });
}

export async function POST(request: Request) {
	const body = (await request.json().catch(() => null)) as ContentProgram | null;
	if (
		!body ||
		typeof body.slug !== "string" ||
		!/^[a-z0-9-]+$/.test(body.slug) ||
		!validateContent(body)
	) {
		return NextResponse.json({ error: "Konten tidak valid." }, { status: 400 });
	}
	try {
		const created = await createProgram(body);
		return created
			? NextResponse.json({ program: created }, { status: 201 })
			: NextResponse.json({ error: "Slug sudah digunakan." }, { status: 409 });
	} catch (err) {
		if (err instanceof Error && err.message === "MYSQL_UNAVAILABLE") {
			return NextResponse.json({ error: "Database tidak tersedia." }, { status: 503 });
		}
		throw err;
	}
}
