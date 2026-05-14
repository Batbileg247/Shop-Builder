import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
/** Neutral placeholder for missing product/hero images (local asset, not stock photography). */
export const IMAGE_PLACEHOLDER = "/file.svg";

/** @deprecated Use IMAGE_PLACEHOLDER; kept for any legacy imports. */
export const IMAGE_FALLBACK = IMAGE_PLACEHOLDER;

/**
 * Returns a usable image URL for Next/Image and <img>.
 * Allows owner uploads (`data:`, `blob:`), app-relative paths, and http(s) URLs.
 */
export function safeImage(url: string): string {
  const t = (url ?? "").trim();
  if (!t) return IMAGE_PLACEHOLDER;
  if (
    t.startsWith("data:") ||
    t.startsWith("blob:") ||
    t.startsWith("/") ||
    t.startsWith("https://") ||
    t.startsWith("http://")
  ) {
    return t;
  }
  return IMAGE_PLACEHOLDER;
}

export function formatMoney(value: number, currency: string): string {
  const formatted = new Intl.NumberFormat("en-US").format(value);
  return currency === "₮" ? `${formatted} ₮` : `${currency}${formatted}`;
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

/** Merchant `normalizeSlug`-тай ижил — дэлгүүрийн path суурь (суффиксээс тусад). */
export function normalizeMerchantSlugBase(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}
