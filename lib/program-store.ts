/**
 * MySQL-backed program store with local seed fallback.
 *
 * Server-only: imports lib/mysql.ts (which is itself server-only).
 * Never import this module from a `"use client"` component.
 *
 * On a database error or when DB env vars are absent, read operations
 * fall back to the seed array in app/data/programs.ts. Write operations
 * surface a structured "MYSQL_UNAVAILABLE" error so API callers can
 * respond with a 503.
 */

import type { Program, ProgramCategory } from "@/app/data/programs";
import { programs as defaultPrograms } from "@/app/data/programs";
import { connection, isDbConfigured, query } from "@/lib/mysql";
import type { ExecuteValues, ResultSetHeader } from "mysql2/promise";

export { validateContent };

export type ContentProgram = Program;

// Mirrors the fixed category set used by the landing page.
const CATEGORY_KEYS: Record<ProgramCategory, string> = {
	"Pendaftaran Baru": "pendaftaran-baru",
	"Pendataan Ulang": "pendataan-ulang",
};

const REVERSE_CATEGORIES: Record<string, ProgramCategory> = Object.fromEntries(
	Object.entries(CATEGORY_KEYS).map(([k, v]) => [v, k as ProgramCategory]),
);

export const categories: ProgramCategory[] = ["Pendaftaran Baru", "Pendataan Ulang"];

export async function getCategories(): Promise<ProgramCategory[]> {
	if (!isDbConfigured()) return categories;
	try {
		const rows = await query<{ key: string; name: string }>(
			"SELECT `key` AS key FROM categories ORDER BY sort_order, name",
		);
		const seen = new Set<ProgramCategory>();
		const order: ProgramCategory[] = [];
		for (const row of rows) {
			const cat = REVERSE_CATEGORIES[row.key];
			if (cat && !seen.has(cat)) {
				seen.add(cat);
				order.push(cat);
			}
		}
		return order.length > 0 ? order : categories;
	} catch {
		return categories;
	}
}

export async function listPrograms(): Promise<Program[]> {
	if (!isDbConfigured()) return defaultPrograms;
	try {
		const rows = await query<{
			slug: string;
			category_key: string;
			name: string;
			summary: string;
			detail: string;
			audience: string;
			url: string | null;
			benefit_enabled: number | boolean;
			benefit_text: string | null;
			benefit_image: string | null;
		}>(
			`SELECT slug, category_key, name, summary, detail, audience, url, benefit_enabled, benefit_text, benefit_image
			 FROM programs
			 ORDER BY FIELD(category_key, 'pendaftaran-baru', 'pendataan-ulang'), sort_order, name`,
		);
		return rows.map((row) => ({
			slug: row.slug,
			category: (REVERSE_CATEGORIES[row.category_key] ?? "Pendaftaran Baru") as ProgramCategory,
			name: row.name,
			summary: row.summary,
			detail: row.detail,
			audience: row.audience,
			url: row.url ?? undefined,
				benefitEnabled: Boolean(row.benefit_enabled),
				benefitText: row.benefit_text ?? "",
				benefitImage: row.benefit_image ?? undefined,
		}));
	} catch {
		return defaultPrograms;
	}
}

export async function getProgram(slug: string): Promise<Program | null> {
	if (!isDbConfigured()) return defaultPrograms.find((p) => p.slug === slug) ?? null;
	try {
		const rows = await query<{
			slug: string;
			category_key: string;
			name: string;
			summary: string;
			detail: string;
			audience: string;
			url: string | null;
			benefit_enabled: number | boolean;
			benefit_text: string | null;
			benefit_image: string | null;
		}>(
			"SELECT slug, category_key, name, summary, detail, audience, url, benefit_enabled, benefit_text, benefit_image FROM programs WHERE slug = ?",
			[slug],
		);
		const row = rows[0];
		if (!row) return null;
		return {
			slug: row.slug,
			category: (REVERSE_CATEGORIES[row.category_key] ?? "Pendaftaran Baru") as ProgramCategory,
			name: row.name,
			summary: row.summary,
			detail: row.detail,
			audience: row.audience,
			url: row.url ?? undefined,
				benefitEnabled: Boolean(row.benefit_enabled),
				benefitText: row.benefit_text ?? "",
				benefitImage: row.benefit_image ?? undefined,
		};
	} catch {
		return defaultPrograms.find((p) => p.slug === slug) ?? null;
	}
}

export async function createProgram(input: ContentProgram): Promise<Program | null> {
	if (!isDbConfigured()) throw new Error("MYSQL_UNAVAILABLE");
	const conn = await connection();
	try {
		const catKey = CATEGORY_KEYS[input.category];
		const [result] = await conn.execute<ResultSetHeader & { affectedRows: number }>(
			`INSERT INTO programs (slug, category_key, name, summary, detail, audience, url, benefit_enabled, benefit_text, benefit_image)
			 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			[
				input.slug,
				catKey,
				input.name,
				input.summary,
				input.detail,
				input.audience,
				input.url ?? null,
				input.benefitEnabled ? 1 : 0,
				input.benefitText?.trim() || null,
				input.benefitImage || null,
			],
		);
		if (result.affectedRows === 0) return null;
		const created = await getProgram(input.slug);
		return created;
	} catch (err: unknown) {
		if (isDuplicateError(err)) return null;
		throw err;
	} finally {
		conn.release();
	}
}

export async function updateProgram(slug: string, input: Partial<ContentProgram>): Promise<Program | null> {
	if (!isDbConfigured()) throw new Error("MYSQL_UNAVAILABLE");
	const conn = await connection();
	try {
		const fields: string[] = [];
		const values: ExecuteValues = [];
		if (input.category !== undefined) {
			fields.push("category_key = ?");
			values.push(CATEGORY_KEYS[input.category]);
		}
		if (input.name !== undefined) {
			fields.push("name = ?");
			values.push(input.name);
		}
		if (input.summary !== undefined) {
			fields.push("summary = ?");
			values.push(input.summary);
		}
		if (input.detail !== undefined) {
			fields.push("detail = ?");
			values.push(input.detail);
		}
		if (input.audience !== undefined) {
			fields.push("audience = ?");
			values.push(input.audience);
		}
		if (input.url !== undefined) {
			fields.push("url = ?");
			values.push(input.url || null);
		}
		if (input.benefitEnabled !== undefined) {
				fields.push("benefit_enabled = ?");
				values.push(input.benefitEnabled ? 1 : 0);
			}
			if (input.benefitText !== undefined) {
				fields.push("benefit_text = ?");
				values.push(input.benefitText.trim() || null);
			}
			if (input.benefitImage !== undefined) {
				fields.push("benefit_image = ?");
				values.push(input.benefitImage || null);
			}
			if (fields.length === 0) return await getProgram(slug);
		values.push(slug);
		const [result] = await conn.execute<ResultSetHeader & { affectedRows: number }>(
			`UPDATE programs SET ${fields.join(", ")} WHERE slug = ?`,
			values,
		);
		if (result.affectedRows === 0) return null;
		return await getProgram(slug);
	} finally {
		conn.release();
	}
}

export async function deleteProgram(slug: string): Promise<boolean> {
	if (!isDbConfigured()) throw new Error("MYSQL_UNAVAILABLE");
	const conn = await connection();
	try {
		const [result] = await conn.execute<ResultSetHeader & { affectedRows: number }>(
			"DELETE FROM programs WHERE slug = ?",
			[slug],
		);
		return result.affectedRows > 0;
	} finally {
		conn.release();
	}
}

// --- validation (moved from lib/content-store.ts) ---

const URL_REGEX = /^https?:\/\//i;

function validateContent(input: Partial<ContentProgram>): boolean {
	return (
		typeof input.name === "string" &&
		input.name.trim().length > 0 &&
		typeof input.summary === "string" &&
		input.summary.trim().length > 0 &&
		typeof input.detail === "string" &&
		input.detail.trim().length > 0 &&
		typeof input.audience === "string" &&
		input.audience.trim().length > 0 &&
		typeof input.category === "string" &&
		categories.includes(input.category as ProgramCategory) &&
		(!input.url || (typeof input.url === "string" && URL_REGEX.test(input.url))) &&
			(input.benefitEnabled !== true || (typeof input.benefitText === "string" && input.benefitText.trim().length > 0)) &&
			(!input.benefitImage || (typeof input.benefitImage === "string" && /^\/uploads\/[A-Za-z0-9._-]+$/.test(input.benefitImage)))
	);
}

function isDuplicateError(err: unknown): boolean {
	if (typeof err === "object" && err !== null && "code" in err) {
		return (err as { code: string }).code === "ER_DUP_ENTRY";
	}
	return false;
}
