import type { CSSProperties } from "react";
import type { ShopTheme } from "@/types";

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
