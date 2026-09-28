// Shared cookie names/options for the Next auth route handlers (src/app/api/auth/*).
// These are the only place that ever touches the raw JWTs — the cookies are
// httpOnly, so browser JS (and src/lib/api.ts) never sees the token values.

export const ACCESS_COOKIE = "access_token";
export const REFRESH_COOKIE = "refresh_token";

// Same default as next.config.mjs — these route handlers talk to Django
// directly (server-to-server), not through the /api/* rewrite.
export const DJANGO_API_URL = process.env.DJANGO_API_URL ?? "http://127.0.0.1:8500/api";

const base = {
  httpOnly: true as const,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

// Lifetimes mirror backend/config/settings.py's SIMPLE_JWT lifetimes.
export const accessCookieOptions = () => ({ ...base, maxAge: 60 * 15 });
export const refreshCookieOptions = () => ({ ...base, maxAge: 60 * 60 * 24 * 7 });
