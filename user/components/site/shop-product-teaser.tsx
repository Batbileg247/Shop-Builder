"use client";

import Image from "next/image";
import * as React from "react";

import type { Product } from "@/types";
import { cn, formatMoney, safeImage } from "@/lib/utils";

/** Featured tile on Theme Studio home. */
export function ShopProductTeaser({
  product,
  currency,
  onClick,
  className,
}: {
  product: Product;
  currency: string;
  onClick?: () => void;
  className?: string;
}) {
  const effective = product.salePrice ?? product.price;
  const Wrapper: React.ElementType = onClick ? "button" : "div";
  return (
    <Wrapper
      {...(onClick
        ? { onClick, type: "button" as const }
        : {})}
      className={cn(
        "block min-h-0 rounded-[length:var(--pv-radius)] text-left outline-none",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pv-border",
        "pv-interactive",
        className,
      )}
    >
      <article
        className={cn(
          "pv-card flex h-full flex-col overflow-hidden transition-none",
          "h-full",
        )}
      >
        <div className="relative aspect-square overflow-hidden border-b border-pv-divider bg-pv-placeholder">
          <Image
            alt={product.name}
            className="object-cover"
            fill
            sizes="(max-width: 640px) 100vw, 33vw"
            src={safeImage(product.image)}
          />
        </div>
        <div className="flex flex-1 flex-col gap-1.5 p-[length:var(--pv-card-content-pad,1rem)]">
          <h3 className="line-clamp-2 text-sm font-medium leading-snug tracking-tight text-pv-fg">
            {product.name}
          </h3>
          <p className="text-xs text-pv-muted">{product.category}</p>
          <p className="mt-auto pt-2 text-sm font-semibold tabular-nums tracking-tight text-pv-fg">
            {formatMoney(effective, currency)}
          </p>
        </div>
      </article>
    </Wrapper>
  );
}
