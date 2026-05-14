"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { Play } from "lucide-react";

import { useShop } from "@/app/hooks/useShop";
import { useBuilderUi } from "@/context/builder-ui-context";
import { builderDemoCtaButtonClassName } from "@/lib/builder-demo-cta-button";
import { storefrontNavBase } from "@/lib/site-paths";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/button";

function SiteHeaderInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { setIsDemo } = useBuilderUi();
  const isStorefront = pathname.startsWith("/s/");
  const shop = useShop();
  const navBase = storefrontNavBase(pathname);
  const catalogHref = `${navBase}?view=all`;
  const cartCount = shop.cartItems.reduce((s, i) => s + i.quantity, 0);
  const cartIntent = searchParams.get("cart") === "open";
  const shopBrowse = searchParams.get("view") === "all";
  const onBuilderHome = pathname === navBase || pathname === `${navBase}/`;
  const onShopPath =
    pathname === `${navBase}/shop` || pathname?.startsWith(`${navBase}/shop/`);
  const onCartPath =
    pathname === `${navBase}/cart` || pathname === `${navBase}/cart/`;
  const cartHref =
    shopBrowse && onBuilderHome
      ? `${navBase}?view=all&cart=open`
      : `${navBase}?cart=open`;
  const shopActive =
    !cartIntent &&
    ((shopBrowse && onBuilderHome) || (onShopPath && !shopBrowse));

  return (
    <header className="pv-header">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-end px-6">
        <nav className="flex items-center gap-1.5 sm:gap-2" aria-label="Main">
          {!isStorefront ? (
            <Button
              type="button"
              variant="default"
              size="lg"
              className={builderDemoCtaButtonClassName()}
              onClick={() => setIsDemo(true)}
            >
              <Play className="size-4 fill-current opacity-95" aria-hidden />
              View Demo
            </Button>
          ) : null}
          <Link
            href={navBase}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-(--pv-radius) px-3 py-1.5 text-sm font-medium tracking-tight transition-none",
              "text-pv-muted pv-interactive",
              onBuilderHome &&
                !shopBrowse &&
                !cartIntent &&
                "bg-pv-card text-pv-fg outline-1 outline-pv-border",
            )}
          >
            Home
          </Link>
          <Link
            href={catalogHref}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-(--pv-radius) px-3 py-1.5 text-sm font-medium tracking-tight transition-none",
              "text-pv-muted pv-interactive",
              shopActive && "bg-pv-card text-pv-fg outline-1 outline-pv-border",
            )}
          >
            Shop
          </Link>
          <Link
            href={cartHref}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-(--pv-radius) px-3 py-1.5 text-sm font-medium tracking-tight transition-none",
              "text-pv-muted pv-interactive",
              (cartIntent || onCartPath) &&
                "bg-pv-card text-pv-fg outline outline-pv-border",
            )}
          >
            Cart
            {cartCount > 0 ? (
              <span className="rounded-(--pv-radius) border border-pv-border bg-pv-card px-1.5 py-0.5 text-xs font-semibold tabular-nums text-pv-fg">
                {cartCount}
              </span>
            ) : null}
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteHeader() {
  return (
    <Suspense
      fallback={<div className="pv-header h-14 border-b border-pv-divider" />}
    >
      <SiteHeaderInner />
    </Suspense>
  );
}
