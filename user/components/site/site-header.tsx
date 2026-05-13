"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { useShop } from "@/app/hooks/useShop";
import { storefrontNavBase } from "@/lib/site-paths";
import { cn } from "@/lib/utils";

function SiteHeaderInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const shop = useShop();
  const navBase = storefrontNavBase(pathname);
  const shopHref = `${navBase}/shop`;
  const cartCount = shop.cartItems.reduce((s, i) => s + i.quantity, 0);
  const cartIntent = searchParams.get("cart") === "open";
  const onShopPath =
    pathname === `${navBase}/shop` || pathname?.startsWith(`${navBase}/shop/`);
  const onCartPath =
    pathname === `${navBase}/cart` || pathname === `${navBase}/cart/`;

  return (
    <header className="pv-header">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link
          href={navBase}
          className={cn(
            "rounded-[length:var(--pv-radius)] px-1 py-0.5 text-sm font-semibold tracking-tight text-pv-fg",
            "pv-interactive transition-none",
          )}
        >
          Store
        </Link>
        <nav className="flex items-center gap-1.5 sm:gap-2" aria-label="Main">
          <Link
            href={navBase}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-[length:var(--pv-radius)] px-3 py-1.5 text-sm font-medium tracking-tight transition-none",
              "text-pv-muted pv-interactive",
              (pathname === navBase || pathname === `${navBase}/`) &&
                "bg-pv-card text-pv-fg outline outline-1 outline-pv-border",
            )}
          >
            Home
          </Link>
          <Link
            href={shopHref}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-[length:var(--pv-radius)] px-3 py-1.5 text-sm font-medium tracking-tight transition-none",
              "text-pv-muted pv-interactive",
              onShopPath &&
                !cartIntent &&
                "bg-pv-card text-pv-fg outline outline-1 outline-pv-border",
            )}
          >
            Shop
          </Link>
          <Link
            href={`${navBase}?cart=open`}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-[length:var(--pv-radius)] px-3 py-1.5 text-sm font-medium tracking-tight transition-none",
              "text-pv-muted pv-interactive",
              (cartIntent || onCartPath) &&
                "bg-pv-card text-pv-fg outline outline-1 outline-pv-border",
            )}
          >
            Cart
            {cartCount > 0 ? (
              <span className="rounded-[length:var(--pv-radius)] border border-pv-border bg-pv-card px-1.5 py-0.5 text-xs font-semibold tabular-nums text-pv-fg">
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
