/** Minimal storefront preview lives under /builder (Theme Studio preview). */
export const BUILDER_PREVIEW_BASE = "/builder" as const;

/** Public storefront routes (`/s/:slug`) vs builder preview (`/builder`). */
export function storefrontNavBase(pathname: string | null): string {
  if (!pathname) return BUILDER_PREVIEW_BASE;
  const m = pathname.match(/^\/s\/([^/]+)/);
  return m ? `/s/${m[1]}` : BUILDER_PREVIEW_BASE;
}

