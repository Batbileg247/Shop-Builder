"use client";

import Link from "next/link";

import type { SiteProduct } from "@/lib/site-mock-products";
import { formatMnt } from "@/lib/site-mock-products";
import { cn } from "@/lib/utils";

type ProductCardProps = {
  product: SiteProduct;
  href: string;
  className?: string;
};

export function ProductCard({ product, href, className }: ProductCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "pv-card group flex flex-col overflow-hidden p-[length:var(--pv-card-content-pad,1rem)] transition-none hover:border-pv-divider",
        className,
      )}
    >
      <div className="pv-visual mb-3 aspect-[4/5] w-full">
        <div className="flex size-full items-center justify-center bg-pv-placeholder">
          <span className="text-4xl font-semibold tabular-nums text-pv-muted">
            {product.name.slice(0, 1)}
          </span>
        </div>
      </div>
      <p className="line-clamp-2 text-sm font-semibold tracking-tight text-pv-fg group-hover:text-pv-link-hover">
        {product.name}
      </p>
      <p className="mt-1 text-xs text-pv-muted">{product.category}</p>
      <p className="mt-2 text-sm font-semibold tabular-nums text-pv-fg">
        {formatMnt(product.price)} ₮
      </p>
    </Link>
  );
}
