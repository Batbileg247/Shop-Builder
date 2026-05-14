/**
 * Centralized public env for the Next.js `user` app.
 * Server-only secrets must live in server actions / Route Handlers, not here.
 */

function truthy(v: string | undefined): boolean {
  return v === "1" || v?.toLowerCase() === "true" || v?.toLowerCase() === "yes";
}

/** Shop CRUD API (your REST backend). When mock is on, dashboard uses in-memory seeds. */
export function isShopBuilderApiMock(): boolean {
  const explicit = process.env.NEXT_PUBLIC_SHOP_BUILDER_USE_MOCK;
  if (explicit != null && explicit !== "") return truthy(explicit);
  return true;
}

/** Base URL for shop-builder REST (no trailing slash). Empty when unset. */
export function getShopBuilderApiBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SHOP_BUILDER_API_URL?.trim() ?? "";
  if (!raw) return "";
  return raw.replace(/\/+$/, "");
}

export function assertShopBuilderApiConfigured(): string {
  const base = getShopBuilderApiBaseUrl();
  if (!base) {
    throw new Error(
      "Set NEXT_PUBLIC_SHOP_BUILDER_API_URL when NEXT_PUBLIC_SHOP_BUILDER_USE_MOCK is false.",
    );
  }
  return base;
}
