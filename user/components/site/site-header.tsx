"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { useShop } from "@/app/hooks/useShop";
import { BUILDER_PREVIEW_BASE } from "@/lib/site-paths";
import { cn } from "@/lib/utils";

const base = BUILDER_PREVIEW_BASE;

function SiteHeaderInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const shop = useShop();
  const cartCount = shop.cartItems.reduce((s, i) => s + i.quantity, 0);
  const cartIntent = searchParams.get("cart") === "open";
  const onShopPath = pathname === base || pathname === `${base}/`;

  return (
    <header className="pv-header">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className={cn(
            "rounded-[length:var(--pv-radius)] px-1 py-0.5 text-sm font-semibold tracking-tight text-pv-fg",
            "pv-interactive transition-none",
          )}
        >
          Store
        </Link>
        <nav className="flex items-center gap-1.5 sm:gap-2" aria-label="Main">
          <Link
            href={base}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-[length:var(--pv-radius)] px-3 py-1.5 text-sm font-medium tracking-tight transition-none",
              "text-pv-muted pv-interactive",
              (pathname === base || pathname === `${base}/`) &&
                "bg-pv-card text-pv-fg outline outline-1 outline-pv-border",
            )}
          >
            Home
          </Link>
          <Link
            href={base}
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
            href={`${base}?cart=open`}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-[length:var(--pv-radius)] px-3 py-1.5 text-sm font-medium tracking-tight transition-none",
              "text-pv-muted pv-interactive",
              onShopPath &&
                cartIntent &&
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
    <Suspense fallback={<div className="pv-header h-14 border-b border-pv-divider" />}>
      <SiteHeaderInner />
    </Suspense>
  );
}
