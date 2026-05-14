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
  adminCustomize: "/admin/customize",

  // User account
  user: "/user",

  // Theme studio / storefront preview (embedded on Customize)
  builder: "/admin/customize",

  // Live storefront helpers
  storefront: (slug: string) => `/s/${slug}` as const,
  storefrontShop: (slug: string) => `/s/${slug}/shop` as const,
  storefrontProduct: (slug: string, id: string) =>
    `/s/${slug}/shop/${id}` as const,
  storefrontCart: (slug: string) => `/s/${slug}/cart` as const,
  storefrontCheckout: (slug: string) => `/s/${slug}/checkout` as const,
} as const;

/** Nav base for theme preview links (same route as customize). */
export const BUILDER_PREVIEW_BASE = PATHS.adminCustomize;

/** Where to send a user after successful login / signup. */
export const DEFAULT_AFTER_LOGIN = PATHS.adminOverview;

/** Where middleware sends unauthenticated users. */
export const LOGIN_PAGE = PATHS.signIn;

/**
 * Returns the nav base prefix for storefront links.
 * On customize preview, links stay under `/admin/customize`.
 * On `/s/:slug/*`, links use `/s/:slug`.
 */
export function storefrontNavBase(pathname: string | null): string {
  if (!pathname) return PATHS.adminCustomize;
  const m = pathname.match(/^\/s\/([^/]+)/);
  return m ? `/s/${m[1]}` : PATHS.adminCustomize;
}
