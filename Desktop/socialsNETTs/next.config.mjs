const DJANGO_API_URL = process.env.DJANGO_API_URL ?? "http://127.0.0.1:8500/api";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Django's URLs are slash-terminated; without this, Next strips the
  // trailing slash (308) before the /api/* rewrite below ever runs.
  skipTrailingSlashRedirect: true,
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.pravatar.cc" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  // Proxy same-origin /api/* to the Django backend so the browser never needs
  // a direct cross-origin/cross-port connection to it.
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${DJANGO_API_URL}/:path*` }];
  },
};

export default nextConfig;
