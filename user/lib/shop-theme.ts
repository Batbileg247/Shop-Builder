import type { CSSProperties } from "react";
import type { ShopTheme } from "@/types";

/** Hero carousel: primary image plus admin-configured gallery only (no product photos). */
export function buildHeroCarouselUrls(theme: ShopTheme): string[] {
  const primary = theme.heroImage?.trim();
  const extras = (theme.heroGallery ?? [])
    .map((s) => String(s).trim())
    .filter(Boolean);
  const urls = [primary, ...extras].filter(
    (u): u is string => Boolean(u && u.length > 0),
  );
  return urls.filter((u, i) => urls.indexOf(u) === i);
}

/** Applies shop Background / Text / Font — use only around storefront previews. */
export function shopPreviewShellStyle(theme: ShopTheme): CSSProperties {
  const fontFamily =
    theme.font === "serif"
      ? 'Georgia, "Times New Roman", serif'
      : theme.font === "mono"
        ? 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'
        : undefined;

  return {
    backgroundColor: theme.backgroundColor,
    color: theme.textColor,
    ...(fontFamily ? { fontFamily } : {}),
  };
}
