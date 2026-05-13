"use client";

import Image from "next/image";
import type { Product } from "@/types";
import { cn, safeImage } from "@/lib/utils";
import { formatStorefrontPrice } from "@/app/components/ecommerce/storefront-price";
import { StarRating } from "@/app/components/ecommerce/StarRating";

function pseudoReviews(productId: string) {
  let h = 0;
  for (let i = 0; i < productId.length; i++) h += productId.charCodeAt(i);
  const reviews = 800 + (h % 4200);
  const rating = 3.8 + (h % 12) / 10;
  return { reviews, rating: Math.min(5, rating) };
}

export function ProductCard({
  product,
  brandLabel,
  onOpen,
}: {
  product: Product;
  brandLabel: string;
  onOpen: () => void;
}) {
  const effective = product.salePrice ?? product.price;
  const { reviews, rating } = pseudoReviews(product.id);
  const reviewLabel = `${(reviews / 1000).toFixed(1)}k`;
  const almostGone = product.inventory > 0 && product.inventory < 6;
  const soldOut = product.inventory === 0;

  return (
    <article
      className={cn(
        "group flex cursor-pointer flex-col overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-black/5 transition hover:shadow-xl",
        soldOut && "opacity-90",
      )}
      onClick={() => {
        if (!soldOut) onOpen();
      }}
      onKeyDown={(e) => {
        if (soldOut) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      role="button"
      tabIndex={soldOut ? -1 : 0}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-zinc-100">
        <Image
          alt={product.name}
          className="object-cover transition duration-500 group-hover:scale-[1.02]"
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          src={safeImage(product.image)}
        />
        {soldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/35 backdrop-blur-[1px]">
            <span className="rounded-full bg-white/95 px-4 py-1.5 text-xs font-semibold tracking-wide text-zinc-800">
              SOLD OUT
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-serif text-base font-semibold leading-snug text-zinc-900">
              {product.name}
            </h3>
            <p className="mt-0.5 text-xs text-zinc-500">{brandLabel}</p>
            <p className="mt-1 text-[11px] text-zinc-400">
              ({reviewLabel}) Customer Reviews
            </p>
          </div>
          <StarRating className="shrink-0 text-sm leading-none" rating={rating} />
        </div>

        <div className="mt-auto flex items-end justify-between gap-2 border-t border-zinc-100 pt-3">
          <div>
            <p className="text-lg font-semibold text-zinc-900">
              {formatStorefrontPrice(effective)}
            </p>
            {product.salePrice && (
              <p className="text-xs text-zinc-400 line-through">
                {formatStorefrontPrice(product.price)}
              </p>
            )}
          </div>
          {almostGone && !soldOut && (
            <p className="text-right text-xs font-medium text-red-600">
              Almost Sold Out
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
