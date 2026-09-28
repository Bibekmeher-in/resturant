import { NextResponse } from "next/server";
import { isRecord } from "@/lib/api/http";
import {
  createAdminSessionToken,
  setAdminSessionCookie,
  verifyAdminCredentials,
} from "@/lib/auth/admin-session";

function authResponse(error: string, status: number): Response {
  return NextResponse.json(
    { success: false, error },
    {
      status,
      headers: { "Cache-Control": "no-store" },
    },
  );
}

export async function POST(request: Request): Promise<Response> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return authResponse("Enter a valid email and password.", 400);
  }

  if (
    !isRecord(body) ||
    typeof body.email !== "string" ||
    typeof body.password !== "string" ||
    body.email.length > 254 ||
    body.password.length > 1024
  ) {
    return authResponse("Enter a valid email and password.", 400);
  }

  const authenticated = verifyAdminCredentials(body.email, body.password);

  if (authenticated === null) {
    return authResponse("Admin sign-in is not configured.", 503);
  }

  if (!authenticated) {
    return authResponse("Invalid email or password.", 401);
  }

  const token = createAdminSessionToken();

  if (!token) {
    return authResponse("Admin sign-in is not configured.", 503);
  }

  await setAdminSessionCookie(token);

  return NextResponse.json(
    { success: true },
    { headers: { "Cache-Control": "no-store" } },
  );
}
