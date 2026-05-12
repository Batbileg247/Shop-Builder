"use client";

import type { ReactNode } from "react";

import type { ShopTheme } from "@/types";
import { shopPreviewShellStyle } from "@/lib/shop-theme";
import { cn } from "@/lib/utils";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/ui/resizable";

/**
 * Vertical split between the storefront hero (carousel) and products — Builder + Storefront only.
 */
export function HeroShelfResizable({
  theme,
  hero,
  belowHero,
  className,
}: {
  theme: ShopTheme;
  hero: ReactNode;
  belowHero: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex w-full max-w-full flex-col overflow-hidden rounded-md border border-black/10 shadow-sm",
        className,
        /* Last so callers cannot collapse height (e.g. min-h-0). Scroll parents often lack height. */
        "min-h-[320px] h-[min(68vh,720px)]",
      )}
      style={shopPreviewShellStyle(theme)}
    >
      <ResizablePanelGroup
        className="flex h-full min-h-0 flex-col"
        orientation="vertical"
      >
        <ResizablePanel
          className="flex min-h-0 flex-col overflow-hidden"
          defaultSize="44%"
          id="shop-hero-panel"
          maxSize="78%"
          minSize="22%"
        >
          <div className="flex h-full min-h-0 flex-col overflow-hidden">{hero}</div>
        </ResizablePanel>

        <ResizableHandle className="bg-border" withHandle />

        <ResizablePanel
          className="flex min-h-0 flex-col overflow-hidden"
          defaultSize="56%"
          id="shop-products-panel"
          minSize="22%"
        >
          <div className="flex min-h-0 flex-1 flex-col overflow-auto">
            {belowHero}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
