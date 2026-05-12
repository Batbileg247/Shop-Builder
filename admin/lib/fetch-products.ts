import { getAxiosPayload, merchantClient } from "@/lib/api-client";
import {
  extractArrayFromUnknown,
  getApiErrorFromBody,
} from "@/lib/normalize-api-response";

export type ProductDisplay = {
  id: string;
  storeId: string;
  name: string;
  price: number;
  description: string | null;
  images: string[];
};

export type ProductsFetchResult = {
  list: ProductDisplay[];
  error: null | "api";
};

function normalizeProduct(raw: unknown): ProductDisplay | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const id = r.id != null ? String(r.id) : "";
  if (!id) return null;

  const storeId =
    r.storeId != null
      ? String(r.storeId)
      : r.store_id != null
        ? String(r.store_id)
        : "";

  const name = r.name != null ? String(r.name) : "Untitled";
  const price = Number(r.price ?? 0);
  const desc = r.description;
  const description =
    desc === null || desc === undefined
      ? null
      : typeof desc === "string"
        ? desc
        : String(desc);

  let images: string[] = [];
  const imgRaw = r.images;
  if (Array.isArray(imgRaw)) {
    images = imgRaw.filter((x): x is string => typeof x === "string");
  }

  return {
    id,
    storeId: storeId || "—",
    name,
    price: Number.isFinite(price) ? price : 0,
    description,
    images,
  };
}

/** GET /admin/products — Merchant API (backend-book.md). */
export async function fetchProducts(): Promise<ProductsFetchResult> {
  try {
    const res = await merchantClient.get<unknown>("/admin/products");
    const raw = getAxiosPayload(res);
    const apiErr = getApiErrorFromBody(raw);
    if (apiErr) {
      console.error("[fetchProducts] API error:", apiErr);
      return { list: [], error: "api" };
    }
    const list = extractArrayFromUnknown(raw);
    const mapped = list
      .map(normalizeProduct)
      .filter((p): p is ProductDisplay => p !== null);
    return { list: mapped, error: null };
  } catch (err) {
    console.error("[fetchProducts] Request failed:", err);
    return { list: [], error: "api" };
  }
}
