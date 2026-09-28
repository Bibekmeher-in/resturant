import { NextResponse } from "next/server";
import { clearAdminSessionCookie } from "@/lib/auth/admin-session";

export async function POST(): Promise<Response> {
  await clearAdminSessionCookie();

  return NextResponse.json(
    { success: true },
    { headers: { "Cache-Control": "no-store" } },
  );
}
