import { NextRequest, NextResponse } from "next/server";
import { ACCESS_COOKIE, DJANGO_API_URL, REFRESH_COOKIE, accessCookieOptions, refreshCookieOptions } from "@/lib/authCookies";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const djangoRes = await fetch(`${DJANGO_API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!djangoRes.ok) {
    const data = await djangoRes.json().catch(() => ({}));
    return NextResponse.json(data, { status: djangoRes.status });
  }

  const { access, refresh } = await djangoRes.json();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ACCESS_COOKIE, access, accessCookieOptions());
  response.cookies.set(REFRESH_COOKIE, refresh, refreshCookieOptions());
  return response;
}
