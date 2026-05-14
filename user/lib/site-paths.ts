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

  // Store builder (theme studio)
  builder: "/builder",

  // Live storefront helpers
  storefront: (slug: string) => `/s/${slug}` as const,
  storefrontShop: (slug: string) => `/s/${slug}/shop` as const,
  storefrontProduct: (slug: string, id: string) =>
    `/s/${slug}/shop/${id}` as const,
  storefrontCart: (slug: string) => `/s/${slug}/cart` as const,
  storefrontCheckout: (slug: string) => `/s/${slug}/checkout` as const,
} as const;

/** @deprecated Use PATHS.builder instead. Kept for backward-compat. */
export const BUILDER_PREVIEW_BASE = PATHS.builder;

/** Where to send a user after successful login / signup. */
export const DEFAULT_AFTER_LOGIN = PATHS.adminOverview;

/** Where middleware sends unauthenticated users. */
export const LOGIN_PAGE = PATHS.signIn;

/**
 * Returns the nav base prefix for storefront links.
 * Inside the builder preview (/builder/*) links stay under /builder.
 * Inside the live storefront (/s/:slug/*) links use /s/:slug.
 */
export function storefrontNavBase(pathname: string | null): string {
  if (!pathname) return PATHS.builder;
  const m = pathname.match(/^\/s\/([^/]+)/);
  return m ? `/s/${m[1]}` : PATHS.builder;
}
