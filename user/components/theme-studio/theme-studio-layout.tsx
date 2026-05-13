"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

import { useStore } from "@/context/store-context";

import { ThemeEditorSidebar } from "./theme-editor-sidebar";

/** `/builder/panel` дээр зөвхөн legacy UI — Theme Editor нууна. */
export function ThemeStudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const {
    currentTheme,
    cardRadiusFollowsTheme,
    cardRadiusPx,
    cardContentPaddingRem,
    productGridGapRem,
  } = useStore();

  const previewCssVars = React.useMemo(
    () =>
      ({
        "--pv-card-content-pad": `${cardContentPaddingRem}rem`,
        "--pv-product-gap": `${productGridGapRem}rem`,
        ...(!cardRadiusFollowsTheme && {
          "--pv-radius": `${cardRadiusPx}px`,
        }),
      }) as React.CSSProperties,
    [
      cardContentPaddingRem,
      productGridGapRem,
      cardRadiusFollowsTheme,
      cardRadiusPx,
    ],
  );

  if (
    pathname.startsWith("/builder/panel") ||
    pathname.startsWith("/builder/catalog")
  ) {
    return <div className="min-h-svh w-full">{children}</div>;
  }

  return (
    <div className="flex min-h-svh w-full bg-zinc-100">
      <div className="fixed left-0 top-0 z-40 h-svh w-[350px] shadow-[4px_0_24px_rgba(0,0,0,0.06)]">
        <ThemeEditorSidebar />
      </div>

      <div className="ml-[350px] flex min-h-svh min-w-0 flex-1 flex-col">
        <div
          data-theme={currentTheme}
          className="site-preview-root min-h-svh flex-1"
          style={previewCssVars}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
