/**
 * Seeds the MySQL `programs` + `categories` tables from app/data/programs.ts.
 *
 * Run once after creating the database & running schema.sql:
 *   node scripts/seed-programs.js
 *
 * Requires DB_* or DATABASE_URL env vars to be set.
 *
 * Note: app/data/programs.ts is an ES module (TypeScript), so we import
 * it dynamically via a tiny tsx-free shim. Since the seed is a one-off
 * dev script, we read the TS source and eval the programs array.
 */

import mysql from "mysql2/promise";
import { readFileSync } from "fs";

// Minimal .env loader (no external deps)
function loadEnv() {
	try {
		const content = readFileSync(".env.local", "utf8");
		for (const line of content.split("\n")) {
			const trimmed = line.trim();
			if (!trimmed || trimmed.startsWith("#")) continue;
			const [key, ...rest] = trimmed.split("=");
			process.env[key.trim()] = rest.join("=").trim();
		}
	} catch { /* no .env.local — rely on real env vars */ }
}
loadEnv();

// Inline the seed data here (kept in sync with app/data/programs.ts)
const programs = [
	{
		slug: "perdata-mahir",
		name: "Pendidikan Kompetensi Kemahiran Menangani Perkara Perdata",
		category: "Pendaftaran Baru",
		summary: "Perkuat kesiapan dan kemahiran dalam menangani perkara perdata.",
		detail: "Program pembelajaran untuk peserta yang ingin mengembangkan kompetensi praktis dalam menangani perkara perdata secara lebih terstruktur.",
		audience: "Praktisi hukum dan peserta yang ingin memperdalam perkara perdata.",
	},
	{
		slug: "advokat-pajak",
		name: "Advokat Pajak",
		category: "Pendaftaran Baru",
		summary: "Bangun pemahaman dan kesiapan praktik pada bidang hukum pajak.",
		detail: "Ruang belajar bagi calon dan praktisi hukum yang ingin mengembangkan fokus keahlian pada isu hukum perpajakan.",
		audience: "Advokat, calon advokat, dan praktisi yang fokus pada pajak.",
	},
	{
		slug: "likuidator-mahir",
		name: "Likuidator",
		category: "Pendaftaran Baru",
		summary: "Kenali kompetensi yang diperlukan untuk menjalankan peran likuidator.",
		detail: "Program pengembangan kompetensi untuk peserta yang ingin memahami proses dan tanggung jawab dalam pelaksanaan likuidasi.",
		audience: "Praktisi hukum dan profesional yang menekuni likuidasi.",
	},
	{
		slug: "omnibuslaw",
		name: "Omnibus Law",
		category: "Pendaftaran Baru",
		summary: "Pelajari perkembangan dan implikasi hukum dari omnibus law.",
		detail: "Program untuk memperbarui perspektif dan pemahaman terhadap perubahan regulasi serta dampaknya bagi praktik hukum.",
		audience: "Praktisi, akademisi, dan peserta yang mengikuti perkembangan regulasi.",
	},
	{
		slug: "advokat-medis-3",
		name: "Advokat Medis 3",
		category: "Pendaftaran Baru",
		summary: "Perluas wawasan pada isu hukum dan praktik advokasi medis.",
		detail: "Program lanjutan bagi peserta yang ingin memahami dinamika pendampingan dan advokasi pada bidang medis.",
		audience: "Praktisi hukum dan peserta yang tertarik pada hukum kesehatan.",
	},
	{
		slug: "pkpa-1",
		name: "PKPA 1",
		category: "Pendaftaran Baru",
		summary: "Informasi pendaftaran PKPA 1 akan tersedia melalui halaman ini.",
		detail: "Tautan formulir untuk program ini belum diberikan. Silakan kembali setelah informasi pendaftaran resmi tersedia.",
		audience: "Calon peserta PKPA 1.",
	},
	{
		slug: "kepailitan",
		name: "Kepailitan",
		category: "Pendataan Ulang",
		summary: "Perbarui data Anda untuk kebutuhan pendataan program kepailitan.",
		detail: "Gunakan pendataan ulang untuk memastikan informasi peserta pada program kepailitan tetap akurat dan terkini.",
		audience: "Peserta atau alumni program kepailitan.",
	},
	{
		slug: "mediator",
		name: "Mediator",
		category: "Pendataan Ulang",
		summary: "Pastikan data Anda tetap tercatat dan relevan pada program mediator.",
		detail: "Pendataan ulang membantu memastikan informasi peserta atau alumni program mediator tetap sesuai dengan kondisi terbaru.",
		audience: "Peserta atau alumni program mediator.",
	},
	{
		slug: "advokat-medis-2",
		name: "Advokat Medis 2",
		category: "Pendataan Ulang",
		summary: "Perbarui data peserta pada program Advokat Medis 2.",
		detail: "Lengkapi pendataan ulang untuk membantu menjaga keakuratan informasi peserta program Advokat Medis 2.",
		audience: "Peserta atau alumni Advokat Medis 2.",
		url: "https://forms.gle/5Yc2uyLB6BAPEahr5",
	},
];

const CATEGORY_KEYS = {
	"Pendaftaran Baru": "pendaftaran-baru",
	"Pendataan Ulang": "pendataan-ulang",
};

async function main() {
	const fromUrl = process.env.DATABASE_URL;
	let config;
	if (fromUrl) {
		const parsed = new URL(fromUrl);
		config = {
			host: parsed.hostname,
			port: parsed.port ? parseInt(parsed.port, 10) : 3306,
			user: parsed.username,
			password: decodeURIComponent(parsed.password ?? ""),
			database: parsed.pathname.slice(1),
			ssl: parsed.searchParams.get("ssl-mode") === "REQUIRED"
				? { rejectUnauthorized: false }
				: undefined,
		};
	} else {
		config = {
			host: process.env.DB_HOST,
			port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_NAME,
			ssl: process.env.DB_SSL_MODE === "REQUIRED"
				? { rejectUnauthorized: false }
				: undefined,
		};
	}

	if (!config.host || !config.user || !config.database) {
		console.error("DB_HOST / DB_USER / DB_NAME (or DATABASE_URL) must be set");
		process.exit(1);
	}

	const conn = await mysql.createConnection(config);
	try {
		for (const p of programs) {
			await conn.execute(
				`INSERT INTO programs (slug, category_key, name, summary, detail, audience, url)
				 VALUES (?, ?, ?, ?, ?, ?, ?)
				 ON DUPLICATE KEY UPDATE
				   category_key = VALUES(category_key),
				   name = VALUES(name),
				   summary = VALUES(summary),
				   detail = VALUES(detail),
				   audience = VALUES(audience),
				   url = VALUES(url)`,
				[
					p.slug,
					CATEGORY_KEYS[p.category],
					p.name,
					p.summary,
					p.detail,
					p.audience,
					p.url ?? null,
				],
			);
			console.log(`✓ upserted ${p.slug}`);
		}
		console.log("\nSeed complete. All programs synced.");
	} finally {
		await conn.end();
	}
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
