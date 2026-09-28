import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ACCESS_COOKIE, DJANGO_API_URL, REFRESH_COOKIE } from "@/lib/authCookies";

export async function POST() {
  const cookieStore = await cookies();
  const refresh = cookieStore.get(REFRESH_COOKIE)?.value;

  if (refresh) {
    // Best-effort blacklist — logout still succeeds client-side even if
    // Django is unreachable or the refresh token was already invalid.
    await fetch(`${DJANGO_API_URL}/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    }).catch(() => {});
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.delete(ACCESS_COOKIE);
  response.cookies.delete(REFRESH_COOKIE);
  return response;
}
