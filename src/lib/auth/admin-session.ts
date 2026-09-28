import "server-only";

import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
  isValidAdminSessionToken,
  SESSION_LIFETIME_SECONDS,
} from "@/lib/auth/session-token";

export { ADMIN_SESSION_COOKIE };

const MIN_SECRET_LENGTH = 32;
const encoder = new TextEncoder();

type AdminCredentials = {
  email: string;
  password: string;
  secret: string;
};

function getAdminCredentials(): AdminCredentials | null {
  const email = process.env.ADMIN_EMAIL?.trim();
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.AUTH_SECRET;

  if (
    !email ||
    !password ||
    !secret ||
    encoder.encode(secret).byteLength < MIN_SECRET_LENGTH
  ) {
    return null;
  }

  return { email, password, secret };
}

function credentialDigest(email: string, password: string): Buffer {
  return createHash("sha256")
    .update(email.trim().toLowerCase())
    .update("\0")
    .update(password)
    .digest();
}

export function verifyAdminCredentials(
  email: string,
  password: string,
): boolean | null {
  const credentials = getAdminCredentials();

  if (!credentials) {
    return null;
  }

  const expected = credentialDigest(credentials.email, credentials.password);
  const actual = credentialDigest(email, password);

  return timingSafeEqual(actual, expected);
}

export async function hasAdminSession(): Promise<boolean> {
  const credentials = getAdminCredentials();

  if (!credentials) {
    return false;
  }

  const cookieStore = await cookies();
  return isValidAdminSessionToken(
    cookieStore.get(ADMIN_SESSION_COOKIE)?.value,
  );
}

export { createAdminSessionToken };

export async function setAdminSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_LIFETIME_SECONDS,
  });
}

export async function clearAdminSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}
