"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { BUILDER_PREVIEW_BASE } from "@/lib/site-paths";
import { selectCartItemCount, useCartStore } from "@/stores/cart-store";
import { cn } from "@/lib/utils";

const base = BUILDER_PREVIEW_BASE;

const links = [
  { href: base, label: "Home" },
  { href: `${base}/shop`, label: "Shop" },
  { href: `${base}/cart`, label: "Cart" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const cartCount = useCartStore(selectCartItemCount);

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
          {links.map(({ href, label }) => {
            const active =
              href === base
                ? pathname === base || pathname === `${base}/`
                : pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-[length:var(--pv-radius)] px-3 py-1.5 text-sm font-medium tracking-tight transition-none",
                  "text-pv-muted pv-interactive",
                  active && "bg-pv-card text-pv-fg outline outline-1 outline-pv-border",
                )}
              >
                {label}
                {label === "Cart" && cartCount > 0 ? (
                  <span className="rounded-[length:var(--pv-radius)] border border-pv-border bg-pv-card px-1.5 py-0.5 text-xs font-semibold tabular-nums text-pv-fg">
                    {cartCount}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
