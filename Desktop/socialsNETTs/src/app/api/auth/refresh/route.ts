import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ACCESS_COOKIE, DJANGO_API_URL, REFRESH_COOKIE, accessCookieOptions, refreshCookieOptions } from "@/lib/authCookies";

export async function POST() {
  const cookieStore = await cookies();
  const refresh = cookieStore.get(REFRESH_COOKIE)?.value;
  if (!refresh) {
    return NextResponse.json({ error: "No session" }, { status: 401 });
  }

  const djangoRes = await fetch(`${DJANGO_API_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });

  if (!djangoRes.ok) {
    const response = NextResponse.json({ error: "Session expired" }, { status: 401 });
    response.cookies.delete(ACCESS_COOKIE);
    response.cookies.delete(REFRESH_COOKIE);
    return response;
  }

  const { access, refresh: rotated } = await djangoRes.json();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ACCESS_COOKIE, access, accessCookieOptions());
  response.cookies.set(REFRESH_COOKIE, rotated, refreshCookieOptions());
  return response;
}
