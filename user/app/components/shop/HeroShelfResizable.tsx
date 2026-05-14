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

const HERO_PANEL_ID = "shop-hero-panel";
const PRODUCTS_PANEL_ID = "shop-products-panel";

/**
 * Wrap `HeroShelfResizable` so `react-resizable-panels` gets a definite height (percent splits need it).
 * Fills viewport under app chrome (header + padding).
 */
export const SHOP_PREVIEW_HOST_CLASS =
  "h-[max(20rem,calc(100dvh-9rem))] min-h-0 w-full";

/** Demo: natural height so the page scrolls (hero → products) on the outer scroll container. */
export const SHOP_PREVIEW_HOST_DEMO_CLASS = "w-full";

/**
 * Vertical split between the storefront hero (carousel) and products — Builder + Storefront only.
 */
export function HeroShelfResizable({
  theme,
  hero,
  belowHero,
  className,
  locked = false,
  heroSizePercent = 44,
  onHeroPercentChange,
}: {
  theme: ShopTheme;
  hero: ReactNode;
  belowHero: ReactNode;
  className?: string;
  /** When true, no drag handle; split uses `heroSizePercent` only. */
  locked?: boolean;
  /** Hero panel height % (clamped to panel min/max). */
  heroSizePercent?: number;
  /** Fires after resizable layout changes (builder). */
  onHeroPercentChange?: (heroPercent: number) => void;
}) {
  const pct = Math.min(78, Math.max(22, heroSizePercent));
  const productsPct = 100 - pct;

  const shellClass = cn(
    "flex h-full min-h-0 w-full max-w-full flex-col overflow-hidden rounded-2xl border border-slate-200/90 shadow-sm",
    className,
  );

  const lockedShellClass = cn(
    "flex w-full max-w-full flex-col overflow-hidden rounded-2xl border border-slate-200/90 shadow-sm",
    className,
  );

  if (locked) {
    const heroPx =
      typeof theme.heroImageHeightPx === "number" &&
      Number.isFinite(theme.heroImageHeightPx) &&
      theme.heroImageHeightPx > 0
        ? theme.heroImageHeightPx
        : null;

    return (
      <div className={lockedShellClass} style={shopPreviewShellStyle(theme)}>
        <div className="flex w-full flex-col">
          <div
            className="flex w-full shrink-0 flex-col overflow-hidden"
            style={
              heroPx != null
                ? {
                    height: heroPx,
                    minHeight: "12rem",
                    maxHeight: "85vh",
                  }
                : {
                    height: `${pct}vh`,
                    minHeight: "12rem",
                  }
            }
          >
            <div className="flex h-full min-h-0 flex-col overflow-hidden">{hero}</div>
          </div>
          <div className="flex w-full flex-col">{belowHero}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={shellClass} style={shopPreviewShellStyle(theme)}>
      <ResizablePanelGroup
        className="flex h-full min-h-0 w-full flex-col"
        defaultLayout={{
          [HERO_PANEL_ID]: pct,
          [PRODUCTS_PANEL_ID]: productsPct,
        }}
        orientation="vertical"
        onLayoutChanged={(layout) => {
          const h = layout[HERO_PANEL_ID];
          if (typeof h === "number" && !Number.isNaN(h)) {
            onHeroPercentChange?.(h);
          }
        }}
      >
        <ResizablePanel
          className="flex min-h-0 flex-col overflow-hidden"
          id={HERO_PANEL_ID}
          maxSize="78%"
          minSize="22%"
        >
          <div className="flex h-full min-h-0 flex-col overflow-hidden">{hero}</div>
        </ResizablePanel>

        <ResizableHandle className="bg-border" withHandle />

        <ResizablePanel
          className="flex min-h-0 flex-col overflow-hidden"
          id={PRODUCTS_PANEL_ID}
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
