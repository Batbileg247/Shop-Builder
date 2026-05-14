import type { SiteProduct } from "@/lib/site-mock-products";
import type { Product as ShopProduct } from "@/types";

export type StorefrontStore = {
  id: string;
  ownerId?: string;
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
  category?: string;
  size?: string;
  sku?: string;
  status?: string;
  inventory?: number;
};

export type StorefrontResponse = {
  store: StorefrontStore;
  categories: string[];
  products: StorefrontProduct[];
};

export function getMerchantBaseUrl() {
  const raw = process.env.NEXT_PUBLIC_MERCHANT_API_URL?.trim() || "";
  return raw.replace(/\/+$/, "");
}

/**
 * Merchant worker `POST /upload` → Cloudinary → `secure_url`.
 * D1 / theme_config дээр base64 биш HTTPS линк хадгалахад ашиглана.
 */
export async function uploadImageViaMerchantApi(
  file: File,
  opts?: { signal?: AbortSignal },
): Promise<string> {
  const base = getMerchantBaseUrl();
  if (!base) {
    throw new Error("NEXT_PUBLIC_MERCHANT_API_URL тохируулаагүй байна.");
  }
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${base.replace(/\/$/, "")}/upload`, {
    method: "POST",
    body: form,
    signal: opts?.signal,
  });
  const data = (await res.json().catch(() => null)) as {
    secure_url?: string;
    error?: string;
    details?: { message?: string };
  } | null;
  if (!res.ok) {
    const detailMsg =
      data?.details &&
      typeof data.details === "object" &&
      typeof data.details.message === "string"
        ? data.details.message
        : null;
    const msg =
      (typeof data?.error === "string" && data.error) ||
      detailMsg ||
      `Upload failed (${res.status})`;
    const extra =
      res.status === 503 &&
      typeof data?.error === "string" &&
      data.error.toLowerCase().includes("cloudinary")
        ? " Worker дээр CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET secret-уудыг тохируулж merchant worker-оо дахин deploy хийнэ үү."
        : "";
    throw new Error(msg + extra);
  }
  const url = data?.secure_url;
  if (typeof url !== "string" || !url.trim()) {
    throw new Error("Зургийн хаяг (secure_url) олдсонгүй.");
  }
  return url.trim();
}

function looksLikeDataImageUrl(s: string): boolean {
  const t = s.trim();
  return t.startsWith("data:image/") && t.includes("base64,");
}

/**
 * Өмнө нь localStorage / DB-д base64 data URL болон хадгалагдсан бол
 * түүнийг Blob болгож Merchant `/upload` дамжуулан Cloudinary `secure_url` болгоно.
 * Аль хэдийн https бол өөрчлөхгүй.
 */
export async function uploadDataUrlViaMerchantApi(
  dataUrl: string,
  opts?: { signal?: AbortSignal },
): Promise<string> {
  const t = dataUrl.trim();
  if (!looksLikeDataImageUrl(t)) return t;
  const blob = await fetch(t).then((r) => r.blob());
  const type = blob.type || "image/jpeg";
  const ext =
    type.includes("png") ? "png" : type.includes("webp") ? "webp" : "jpg";
  const file = new File([blob], `hero.${ext}`, { type });
  return uploadImageViaMerchantApi(file, opts);
}

/** Hero primary + gallery — бүх data URL-ийг Cloudinary линк болгож буцаана. */
export async function resolveThemeImageUrlsForStorage(
  heroImage: string,
  heroGallery: string[],
  opts?: { signal?: AbortSignal },
): Promise<{ heroImage: string; heroGallery: string[] }> {
  const hi = await uploadDataUrlViaMerchantApi(heroImage, opts);
  const gal = await Promise.all(
    heroGallery.map((u) => uploadDataUrlViaMerchantApi(u, opts)),
  );
  return { heroImage: hi, heroGallery: gal };
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

export type StorefrontCheckoutLine = {
  productId: string;
  quantity: number;
};

export type StorefrontCheckoutBody = {
  buyerName: string;
  buyerEmail?: string;
  giftWrap?: boolean;
  lines: StorefrontCheckoutLine[];
  /** Илгээвэл серверийн нийт дүнтэй тааруулна (сонголттой). */
  totalPrice?: number;
};

export type StorefrontCheckoutResponse = {
  orderId: string;
  totalPrice: number;
};

export async function postStorefrontCheckout(
  slug: string,
  body: StorefrontCheckoutBody,
  opts?: { signal?: AbortSignal },
): Promise<StorefrontCheckoutResponse> {
  const base = getMerchantBaseUrl();
  if (!base) throw new Error("NEXT_PUBLIC_MERCHANT_API_URL тохируулаагүй байна.");
  const res = await fetch(
    `${base}/storefront/${encodeURIComponent(slug)}/checkout`,
    {
      method: "POST",
      signal: opts?.signal,
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
    },
  );
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const o = data && typeof data === "object" ? (data as Record<string, unknown>) : null;
    const err = o && typeof o.error === "string" ? o.error : `Checkout failed (${res.status})`;
    const extra: string[] = [];
    if (o && typeof o.detail === "string" && o.detail) extra.push(o.detail);
    if (o && o.expected != null && o.received != null) {
      extra.push(`expected ${String(o.expected)}, got ${String(o.received)}`);
    }
    const msg = extra.length ? `${err} (${extra.join("; ")})` : err;
    throw new Error(msg);
  }
  return data as StorefrontCheckoutResponse;
}

/** Storefront API → `useShop` catalog (HomePage, filters, cart). */
export function mapStorefrontProductsToShop(
  products: StorefrontProduct[],
): ShopProduct[] {
  return products.map((p, index) => {
    const images = Array.isArray(p.images) ? p.images : [];
    const img =
      typeof images[0] === "string" && images[0].trim()
        ? images[0].trim()
        : "";
    const cat = (p.category ?? "").trim() || "Uncategorized";
    const sz = (p.size ?? "").trim() || "One size";
    const inv =
      typeof p.inventory === "number" && Number.isFinite(p.inventory)
        ? Math.max(0, Math.round(p.inventory))
        : 0;
    const price =
      typeof p.price === "number" && Number.isFinite(p.price)
        ? p.price
        : Math.round(Number(p.price)) || 0;
    return {
      id: p.id,
      name: p.name,
      category: cat,
      size: sz,
      description: (p.description ?? "").trim(),
      price,
      inventory: inv,
      image: img,
      featured: index < 3,
    };
  });
}

function mergeCategoryLists(
  fromApi: string[] | undefined,
  products: StorefrontProduct[],
): string[] {
  const set = new Set<string>();
  for (const c of fromApi ?? []) {
    const t = c.trim();
    if (t) set.add(t);
  }
  for (const p of products) {
    const t = (p.category ?? "").trim();
    if (t) set.add(t);
  }
  return [...set].sort((a, b) => a.localeCompare(b));
}

/** API response → category filter list for `replaceProducts`. */
export function categoriesForStorefrontResponse(
  res: StorefrontResponse,
): string[] {
  return mergeCategoryLists(res.categories, res.products);
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
    category: (p.category ?? "").trim() || "General",
    sizes: ["One size"],
    colors: ["Default"],
  }));
}

