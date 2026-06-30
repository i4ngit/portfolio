import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "admin_session";

async function isValidSession(cookieValue: string): Promise<boolean> {
  const secret = process.env.SESSION_SECRET ?? "dev-secret-change-me";
  const lastDot = cookieValue.lastIndexOf(".");
  if (lastDot === -1) return false;

  const value = cookieValue.slice(0, lastDot);
  const sigHex = cookieValue.slice(lastDot + 1);

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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Inject pathname as header so server layouts can read it
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const sessionCookie = request.cookies.get(SESSION_COOKIE);
    if (!sessionCookie || !(await isValidSession(sessionCookie.value))) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/admin/:path*"],
};
