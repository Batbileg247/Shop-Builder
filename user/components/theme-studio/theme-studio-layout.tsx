"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

import { useThemeStore } from "@/stores/useThemeStore";

import { ThemeEditorSidebar } from "./theme-editor-sidebar";

/** Theme Studio shell for `/builder` routes. */
export function ThemeStudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const preset = useThemeStore((s) => s.preset);
  const radius = useThemeStore((s) => s.radius);
  const cardContentPaddingRem = useThemeStore((s) => s.cardContentPaddingRem);
  const productGridGapRem = useThemeStore((s) => s.productGridGapRem);

  const previewCssVars = React.useMemo(
    () =>
      ({
        "--pv-card-content-pad": `${cardContentPaddingRem}rem`,
        "--pv-product-gap": `${productGridGapRem}rem`,
        "--pv-radius": `${radius}px`,
      }) as React.CSSProperties,
    [
      cardContentPaddingRem,
      productGridGapRem,
      radius,
    ],
  );

  return (
    <div className="flex min-h-svh w-full bg-zinc-100">
      <div className="fixed left-0 top-0 z-40 h-svh w-[350px] shadow-[4px_0_24px_rgba(0,0,0,0.06)]">
        <ThemeEditorSidebar />
      </div>

      <div className="ml-[350px] flex min-h-svh min-w-0 flex-1 flex-col">
        <div
          data-theme={preset}
          className="site-preview-root min-h-svh flex-1"
          style={previewCssVars}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
