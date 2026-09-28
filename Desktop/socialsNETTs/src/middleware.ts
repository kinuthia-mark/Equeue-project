import { NextRequest, NextResponse } from "next/server";
import { ACCESS_COOKIE } from "@/lib/authCookies";

// Presence-only gate: this is a UX convenience (avoid flashing a protected
// page before an inevitable 401) — it is NOT the security boundary. The
// access token isn't verified here (no JWT secret in the Next runtime);
// Django's IsAuthenticated check on every API call is the real enforcement.
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has(ACCESS_COOKIE);
  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isPublic = pathname === "/" || pathname.startsWith("/api/");

  if (!hasSession && !isAuthPage && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (hasSession && isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
