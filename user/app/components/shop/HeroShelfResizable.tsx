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
 * Wrap `HeroShelfResizable` so `react-resizable-panels` gets a definite height (percent splits need it).
 * Fills viewport under app chrome (header + padding).
 */
export const SHOP_PREVIEW_HOST_CLASS =
  "h-[max(20rem,calc(100dvh-9rem))] min-h-0 w-full";

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
        "flex h-full min-h-0 w-full max-w-full flex-col overflow-hidden rounded-md border border-black/10 shadow-sm",
        className,
      )}
      style={shopPreviewShellStyle(theme)}
    >
      <ResizablePanelGroup
        className="flex h-full min-h-0 w-full flex-col"
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
          <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
            {belowHero}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
