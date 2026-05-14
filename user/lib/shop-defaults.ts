import type { Shop } from "@/types/dashboard";

/** Defaults applied when a shop row is created (mock, seeds, or API insert). */
export function createShopWithStyle(input: {
  id: string;
  name: string;
  ownerId: string;
  logoUrl: string;
  brandColor: string;
  accentColor: string;
  currency?: Shop["currency"];
  radiusPx?: number;
  backgroundColor?: string;
  tagline?: string;
  textColor?: string;
  createdAt?: Date;
  updatedAt?: Date;
}): Shop {
  const now = new Date();
  return {
    id: input.id,
    name: input.name,
    ownerId: input.ownerId,
    logoUrl: input.logoUrl,
    brandColor: input.brandColor,
    accentColor: input.accentColor,
    currency: input.currency ?? "USD",
    radiusPx: input.radiusPx ?? 8,
    backgroundColor: input.backgroundColor ?? "#f8fafc",
    tagline:
      input.tagline?.trim() ||
      "Quality products, thoughtfully curated.",
    textColor: input.textColor ?? "#0f172a",
    createdAt: input.createdAt ?? now,
    updatedAt: input.updatedAt ?? now,
  };
}
