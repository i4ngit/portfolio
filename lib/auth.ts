import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

export const SESSION_COOKIE = "admin_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

async function hmacHex(secret: string, value: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function buildSignedSession(): Promise<string> {
  const secret = process.env.SESSION_SECRET ?? "dev-secret-change-me";
  const value = "authenticated";
  const sig = await hmacHex(secret, value);
  return `${value}.${sig}`;
}

export async function verifyPassword(plain: string): Promise<boolean> {
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!hash) {
    return plain === "admin";
  }
  return bcrypt.compare(plain, hash);
}

export async function getSession(): Promise<boolean> {
  const cookieStore = cookies();
  const cookie = cookieStore.get(SESSION_COOKIE);
  if (!cookie) return false;

  const secret = process.env.SESSION_SECRET ?? "dev-secret-change-me";
  const lastDot = cookie.value.lastIndexOf(".");
  if (lastDot === -1) return false;

  const value = cookie.value.slice(0, lastDot);
  const sigHex = cookie.value.slice(lastDot + 1);

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );
  const sigBytes = new Uint8Array(
    sigHex.match(/.{2}/g)?.map((b) => parseInt(b, 16)) ?? []
  );
  return crypto.subtle.verify("HMAC", key, sigBytes, encoder.encode(value));
}
