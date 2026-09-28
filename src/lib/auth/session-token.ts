import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

const MIN_SECRET_LENGTH = 32;
const SESSION_LIFETIME_SECONDS = 60 * 60 * 8;
export const ADMIN_SESSION_COOKIE = "ember-table-admin-session";

function getAuthSecret(): string | null {
  const secret = process.env.AUTH_SECRET;

  return secret && Buffer.byteLength(secret, "utf8") >= MIN_SECRET_LENGTH
    ? secret
    : null;
}

function sign(payload: string, secret: string): Buffer {
  return createHmac("sha256", secret).update(payload).digest();
}

export function createAdminSessionToken(): string | null {
  const secret = getAuthSecret();

  if (!secret) {
    return null;
  }

  const payload = Buffer.from(
    JSON.stringify({
      version: 1,
      expiresAt: Math.floor(Date.now() / 1000) + SESSION_LIFETIME_SECONDS,
    }),
  ).toString("base64url");

  return `${payload}.${sign(payload, secret).toString("base64url")}`;
}

export function isValidAdminSessionToken(token: string | undefined): boolean {
  const secret = getAuthSecret();

  if (!secret || !token || token.length > 1024) {
    return false;
  }

  const [payload, signature, extra] = token.split(".");

  if (
    !payload ||
    !signature ||
    extra !== undefined ||
    !/^[A-Za-z0-9_-]+$/.test(payload) ||
    !/^[A-Za-z0-9_-]+$/.test(signature)
  ) {
    return false;
  }

  const actualSignature = Buffer.from(signature, "base64url");
  const expectedSignature = sign(payload, secret);

  if (
    actualSignature.length !== expectedSignature.length ||
    !timingSafeEqual(actualSignature, expectedSignature)
  ) {
    return false;
  }

  try {
    const session: unknown = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    );

    if (
      typeof session !== "object" ||
      session === null ||
      !("version" in session) ||
      !("expiresAt" in session) ||
      session.version !== 1 ||
      typeof session.expiresAt !== "number" ||
      !Number.isSafeInteger(session.expiresAt)
    ) {
      return false;
    }

    return session.expiresAt > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export { SESSION_LIFETIME_SECONDS };
