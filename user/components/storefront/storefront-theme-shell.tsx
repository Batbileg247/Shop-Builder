"use client";

import * as React from "react";

import { useThemeStore } from "@/stores/useThemeStore";

/**
 * Wraps all `/s/:slug` routes so `site-preview-root[data-theme]` and layout
 * `--pv-*` overrides match the theme store (same surface as {@link HomePage} preview).
 */
export function StorefrontThemeShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const preset = useThemeStore((s) => s.preset);
  const radius = useThemeStore((s) => s.radius);
  const cardContentPaddingRem = useThemeStore((s) => s.cardContentPaddingRem);
  const productGridGapRem = useThemeStore((s) => s.productGridGapRem);
  const previewProductCardBasisRem = useThemeStore(
    (s) => s.previewProductCardBasisRem,
  );
  const primaryColor = useThemeStore((s) => s.primaryColor);

  const style = React.useMemo(
    () =>
      ({
        "--pv-card-content-pad": `${cardContentPaddingRem}rem`,
        "--pv-product-gap": `${productGridGapRem}rem`,
        "--pv-preview-card-basis": `${previewProductCardBasisRem}rem`,
        "--pv-radius": `${radius}px`,
        "--pv-primary": primaryColor,
      }) as React.CSSProperties,
    [
      cardContentPaddingRem,
      productGridGapRem,
      previewProductCardBasisRem,
      radius,
      primaryColor,
    ],
  );

  return (
    <div
      className="site-preview-root min-h-svh w-full bg-pv-bg text-pv-fg"
      data-theme={preset}
      style={style}
    >
      {children}
    </div>
  );
}
