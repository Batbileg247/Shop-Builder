import type { NextConfig } from "next";

/**
 * Builder + storefront preview-д зориулсан backend base URLs.
 * Production-д `.env.local` дээрээс дарж тохируулна.
 */
const DEFAULT_PLATFORM_API =
  "https://unlimited-team-platform-api.gankhulug12345.workers.dev";
const DEFAULT_MERCHANT_API =
  "https://unlimited-team-merchant-api.gankhulug12345.workers.dev";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  env: {
    NEXT_PUBLIC_PLATFORM_API_URL:
      process.env.NEXT_PUBLIC_PLATFORM_API_URL?.trim() || DEFAULT_PLATFORM_API,
    NEXT_PUBLIC_MERCHANT_API_URL:
      process.env.NEXT_PUBLIC_MERCHANT_API_URL?.trim() || DEFAULT_MERCHANT_API,
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
