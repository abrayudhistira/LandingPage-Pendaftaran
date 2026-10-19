import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { query } from "@/lib/mysql";

const ADMIN_EMAIL = "lbhambarsan@gmail.com";
const COOKIE_NAME = "ambarsan_admin_session";
const SESSION_TTL = 60 * 60 * 8;

function sessionSecret() {
	return process.env.ADMIN_SESSION_SECRET ?? "development-only-change-this-secret";
}

export function getSessionCookieName() {
	return COOKIE_NAME;
}

export async function verifyCredentials(email: string, password: string): Promise<boolean> {
	if (email.trim().toLowerCase() !== ADMIN_EMAIL) return false;
	const rows = await query<{ password_salt: string; password_hash: string }>(
		"SELECT password_salt, password_hash FROM admin_accounts WHERE email = ?",
		[ADMIN_EMAIL],
	);
	const row = rows[0];
	if (!row) return false;
	const candidate = scryptSync(password, row.password_salt, 64);
	return timingSafeEqual(candidate, Buffer.from(row.password_hash, "hex"));
}

export function createSessionToken() {
	const payload = `${Date.now() + SESSION_TTL * 1000}.${randomBytes(16).toString("hex")}`;
	const signature = createHmac("sha256", sessionSecret()).update(payload).digest("hex");
	return `${payload}.${signature}`;
}

export function isValidSessionToken(token?: string) {
	if (!token) return false;
	const parts = token.split(".");
	if (parts.length !== 3) return false;
	const [expires, nonce, signature] = parts;
	if (!Number.isFinite(Number(expires)) || Number(expires) < Date.now()) return false;
	const expected = createHmac("sha256", sessionSecret()).update(`${expires}.${nonce}`).digest("hex");
	return signature.length === expected.length && timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

export { SESSION_TTL };
