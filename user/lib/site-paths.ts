/** Central path registry — import from here, never hardcode routes. */

export const PATHS = {
  // Public
  home: "/",
  signIn: "/signin",
  signUp: "/signup",

  // Post-login destination
  adminOverview: "/admin/overview",

  // Admin sub-pages
  adminProducts: "/admin/products",
  adminCustomers: "/admin/customers",
  adminAnalytics: "/admin/analytics",
  adminShop: "/admin/shop",

  // User account
  user: "/user",

  /** Legacy builder root (redirects to update in app). */
  builder: "/builder",
  /** Theme studio: edit existing shop preview. */
  builderUpdate: "/builder/update",
  /** Theme studio: start a new shop from dashboard. */
  builderCreate: "/builder/create",
  /** Landing “Generate site” → create flow (separate prefix). */
  buildingCreate: "/building/create",

  // Live storefront helpers
  /** Public storefront uses stable shop `id` in the path segment (`/s/:id`). */
  storefront: (shopId: string) => `/s/${shopId}` as const,
  storefrontShop: (shopId: string) => `/s/${shopId}/shop` as const,
  storefrontProduct: (shopId: string, id: string) =>
    `/s/${shopId}/shop/${id}` as const,
  storefrontCart: (shopId: string) => `/s/${shopId}/cart` as const,
  storefrontCheckout: (shopId: string) => `/s/${shopId}/checkout` as const,
} as const;

/** Default preview base for editor cart / shop links (update flow). */
export const BUILDER_PREVIEW_BASE = PATHS.builderUpdate;

/** Where to send a user after successful login / signup. */
export const DEFAULT_AFTER_LOGIN = PATHS.adminOverview;

/** Where middleware sends unauthenticated users. */
export const LOGIN_PAGE = PATHS.signIn;

/** Dashboard + theme preview surfaces that use the constrained column layout. */
export function isBuilderPreviewPath(pathname: string | null): boolean {
  if (!pathname) return false;
  return pathname.startsWith("/builder") || pathname.startsWith("/building");
}

/**
 * Returns the nav base prefix for storefront links (cart, shop, etc.).
 * Uses the current `/builder/...` or `/building/...` path so cart opens on the same mode.
 */
export function storefrontNavBase(pathname: string | null): string {
  if (!pathname) return PATHS.builderUpdate;
  const m = pathname.match(/^\/s\/([^/]+)/);
  if (m) return `/s/${m[1]}`;
  if (pathname.startsWith("/builder") || pathname.startsWith("/building")) {
    const clean = pathname.split("?")[0].replace(/\/$/, "");
    return clean || PATHS.builder;
  }
  return PATHS.adminShop;
}
