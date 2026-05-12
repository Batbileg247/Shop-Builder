import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const IMAGE_FALLBACK =
  "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1200&q=80";

export function safeImage(url: string): string {
  return url.startsWith("https://images.unsplash.com/") ? url : IMAGE_FALLBACK;
}

export function formatMoney(value: number, currency: string): string {
  const formatted = new Intl.NumberFormat("en-US").format(value);
  return currency === "₮" ? `${formatted} ₮` : `${currency}${formatted}`;
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}
