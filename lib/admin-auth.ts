import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const ADMIN_EMAIL = "lbhambarsan@gmail.com";
const PASSWORD_SALT = "c806e81cf1826bb09e9b8c632238fb9e";
const PASSWORD_HASH = "532e12fc0826b0c2ff1c73f124d4b7c9a9679fb9c42a572282cdc45e9af5771f6a539c9d0dcefab7ea06216080946a0f0bd8022e84b37c21bb5925ce744773b1";
const COOKIE_NAME = "ambarsan_admin_session";
const SESSION_TTL = 60 * 60 * 8;

function sessionSecret() {
  return process.env.ADMIN_SESSION_SECRET ?? "development-only-change-this-secret";
}

export function getSessionCookieName() { return COOKIE_NAME; }

export function verifyCredentials(email: string, password: string) {
  if (email.trim().toLowerCase() !== ADMIN_EMAIL) return false;
  const candidate = scryptSync(password, PASSWORD_SALT, 64);
  return timingSafeEqual(candidate, Buffer.from(PASSWORD_HASH, "hex"));
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
