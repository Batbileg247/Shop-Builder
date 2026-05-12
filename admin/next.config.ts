import type { NextConfig } from "next";

/**
 * NEXT_PUBLIC_* нь .env.local байхгүй үед хоосон үлдэж Axios "Invalid URL" өгнө.
 * Жишээ Workers (backend-book.md / .env.example-тай ижил) — production-д өөрийн URL-аар .env.local-аар дарна.
 */
const DEFAULT_PLATFORM_API =
  "https://unlimited-team-platform-api.gankhulug12345.workers.dev";
const DEFAULT_MERCHANT_API =
  "https://unlimited-team-merchant-api.gankhulug12345.workers.dev";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_PLATFORM_API_URL:
      process.env.NEXT_PUBLIC_PLATFORM_API_URL?.trim() || DEFAULT_PLATFORM_API,
    NEXT_PUBLIC_MERCHANT_API_URL:
      process.env.NEXT_PUBLIC_MERCHANT_API_URL?.trim() || DEFAULT_MERCHANT_API,
  },
};

export default nextConfig;
