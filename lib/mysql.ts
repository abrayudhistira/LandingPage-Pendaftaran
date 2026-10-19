/**
 * Server-only MySQL connection pool.
 *
 * This module must NEVER be imported from a client component (`"use client"`).
 * It is imported exclusively by:
 *   - API route handlers (server context)
 *   - Server components
 *   - lib/admin-auth.ts (server-only credential verification)
 *
 * Importing this in client code re-introduces the `node:fs/promises` /
 * native-module bundling panic seen previously under Turbopack.
 */

import { readFileSync } from "node:fs";
import mysql, { type ExecuteValues, type Pool, type RowDataPacket } from "mysql2/promise";
type SqlExpr = ExecuteValues;

export interface DbConfig {
	host: string;
	port: number;
	user: string;
	password: string;
	database: string;
	ssl?: object;
}

function parseUrl(url: string): DbConfig {
	const parsed = new URL(url);
	const sslMode = parsed.searchParams.get("ssl-mode");
	return {
		host: parsed.hostname,
		port: parsed.port ? parseInt(parsed.port, 10) : 3306,
		user: parsed.username,
		password: decodeURIComponent(parsed.password ?? ""),
		database: parsed.pathname.slice(1) || "defaultdb",
		ssl: sslMode === "REQUIRED" ? parseSslConfig(process.env.DB_SSL_CA) : undefined,
	};
}

/**
 * Build the `ssl` option for mysql2.
 * - With a CA path: use it (production-safe).
 * - With "self-signed-tolerant": allow self-signed certs (for Aiven dev).
 * - Default REQUIRED: rejectUnauthorized=false (dev convenience; override with CA in prod).
 */
function parseSslConfig(caPath?: string): object {
	if (caPath) {
		return { ca: readFileSync(caPath) };
	}
	return { rejectUnauthorized: false };
}

function fromEnv(): DbConfig | null {
	if (process.env.DATABASE_URL) {
		try {
			return parseUrl(process.env.DATABASE_URL);
		} catch {
			// fall through to individual vars
		}
	}
	if (
		!process.env.DB_HOST ||
		!process.env.DB_USER ||
		!process.env.DB_NAME
	) {
		return null;
	}
	const sslMode = process.env.DB_SSL_MODE;
	return {
		host: process.env.DB_HOST,
		port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD ?? "",
		database: process.env.DB_NAME,
		ssl: sslMode === "REQUIRED" ? parseSslConfig(process.env.DB_SSL_CA) : undefined,
	};
}

let pool: Pool | null = null;

export function isDbConfigured(): boolean {
	return fromEnv() !== null;
}

export function getPool(): Pool {
	if (!pool) {
		const config = fromEnv();
		if (!config) {
			throw new Error("MYSQL_UNAVAILABLE: DATABASE_URL/DB_* env vars are not set");
		}
		pool = mysql.createPool({
			host: config.host,
			port: config.port,
			user: config.user,
			password: config.password,
			database: config.database,
			ssl: config.ssl,
			waitForConnections: true,
			connectionLimit: 10,
			queueLimit: 0,
		});
	}
	return pool;
}

/**
 * Acquire a pooled connection that must be released via `conn.release()`.
 * Caller is responsible for wrapping in try/finally.
 */
export async function connection() {
	return getPool().getConnection();
}

/**
 * Run a SELECT-style query and return rows typed as T[].
 * Uses `pool.execute` so results are returned as plain objects (no prepare cache).
 */
export async function query<T = unknown>(sql: string, params?: SqlExpr[]): Promise<T[]> {
	const [rows] = await getPool().execute<RowDataPacket[]>(sql, params as never);
	return rows as T[];
}
