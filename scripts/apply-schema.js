import mysql from "mysql2/promise";
import { readFileSync } from "fs";

// Minimal .env loader
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

const url = new URL(process.env.DATABASE_URL || "");
const config = {
	host: url.hostname,
	port: parseInt(url.port, 10),
	user: url.username,
	password: decodeURIComponent(url.password || ""),
	database: url.pathname.slice(1) || "defaultdb",
	ssl: url.searchParams.get("ssl-mode") === "REQUIRED"
		? { rejectUnauthorized: false }
		: undefined,
};

async function main() {
	const conn = await mysql.createConnection(config);
	try {
		const sql = readFileSync("lib/migrations/schema.sql", "utf8");
		// Split on semicolons but keep statement-level execution safe
		const statements = sql.split(";").map((s) => s.trim()).filter((s) => s.length > 0);
		for (const stmt of statements) {
			await conn.query(stmt);
			console.log("✓", stmt.substring(0, 60).replace(/\s+/g, " "));
		}
		console.log("\n✓ Schema applied successfully");
	} finally {
		await conn.end();
	}
}

main().catch((err) => {
	console.error("✗ Schema failed:", err.message);
	process.exit(1);
});
