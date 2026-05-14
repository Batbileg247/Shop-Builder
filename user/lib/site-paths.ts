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
  /** Branding / identity for the active shop (sidebar switcher). */
  adminShop: "/admin/shop",

  // User account
  user: "/user",

  // Full-screen theme studio (preview + editor sidebar)
  builder: "/builder",

  // Live storefront helpers
  storefront: (slug: string) => `/s/${slug}` as const,
  storefrontShop: (slug: string) => `/s/${slug}/shop` as const,
  storefrontProduct: (slug: string, id: string) =>
    `/s/${slug}/shop/${id}` as const,
  storefrontCart: (slug: string) => `/s/${slug}/cart` as const,
  storefrontCheckout: (slug: string) => `/s/${slug}/checkout` as const,
} as const;

/** Nav base for theme preview links (Theme studio route). */
export const BUILDER_PREVIEW_BASE = PATHS.builder;

/** Where to send a user after successful login / signup. */
export const DEFAULT_AFTER_LOGIN = PATHS.adminOverview;

/** Where middleware sends unauthenticated users. */
export const LOGIN_PAGE = PATHS.signIn;

/**
 * Returns the nav base prefix for storefront links.
 * On `/builder`, cart and shop links stay under `/builder`.
 * On `/s/:slug/*`, links use `/s/:slug`.
 * Else admin (e.g. shop settings) falls back to `PATHS.adminShop` for legacy relative paths.
 */
export function storefrontNavBase(pathname: string | null): string {
  if (!pathname) return PATHS.builder;
  const m = pathname.match(/^\/s\/([^/]+)/);
  if (m) return `/s/${m[1]}`;
  if (pathname === "/builder" || pathname.startsWith("/builder/")) {
    return PATHS.builder;
  }
  return PATHS.adminShop;
}
