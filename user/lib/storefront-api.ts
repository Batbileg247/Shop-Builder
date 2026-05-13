import type { SiteProduct } from "@/lib/site-mock-products";

export type StorefrontStore = {
  id: string;
  name: string;
  slug: string;
  themeConfig?: unknown;
};

export type StorefrontProduct = {
  id: string;
  storeId: string;
  name: string;
  price: number;
  description: string | null;
  images: string[];
};

export type StorefrontResponse = {
  store: StorefrontStore;
  products: StorefrontProduct[];
};

export function getMerchantBaseUrl() {
  return process.env.NEXT_PUBLIC_MERCHANT_API_URL?.trim() || "";
}

export async function fetchStorefrontBySlug(
  slug: string,
  opts?: { signal?: AbortSignal },
): Promise<StorefrontResponse> {
  const base = getMerchantBaseUrl();
  if (!base) throw new Error("NEXT_PUBLIC_MERCHANT_API_URL тохируулаагүй байна.");
  const res = await fetch(`${base}/storefront/${encodeURIComponent(slug)}`, {
    method: "GET",
    signal: opts?.signal,
    headers: { "Accept": "application/json" },
    cache: "no-store",
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.error || `Storefront fetch failed (${res.status})`);
  }
  return data as StorefrontResponse;
}

/**
 * Манай одоогийн UI (mock) нь category/sizes/colors ашигладаг тул backend product-оо
 * минимал mapping хийж `SiteProduct` болгож өгнө.
 */
export function mapToSiteProducts(products: StorefrontProduct[]): SiteProduct[] {
  return products.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description || "",
    price: p.price,
    category: "General",
    sizes: ["One size"],
    colors: ["Default"],
  }));
}

