import { NextResponse, type NextRequest } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  isValidAdminSessionToken,
} from "@/lib/auth/session-token";

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  if (pathname === "/api/orders" && request.method === "POST") {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;

  if (isValidAdminSessionToken(token)) {
    return NextResponse.next();
  }

  if (pathname === "/api/orders" || pathname.startsWith("/api/orders/")) {
    return NextResponse.json(
      { success: false, error: "Authentication required" },
      {
        status: 401,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }

  return NextResponse.redirect(new URL("/admin/login", request.url));
}

export const config = {
  matcher: [
    "/admin/orders/:path*",
    "/api/orders",
    "/api/orders/:path*",
  ],
};
