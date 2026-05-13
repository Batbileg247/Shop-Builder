"use client";

import type { Product } from "@/types";
import { ProductCard } from "@/app/components/ecommerce/ProductCard";

export function ProductGrid({
  products,
  brandLabel,
  onProductOpen,
  variant = "default",
}: {
  products: Product[];
  brandLabel: string;
  onProductOpen: (product: Product) => void;
  /** `dense` uses up to 4 columns on wide screens (full catalog). */
  variant?: "default" | "dense";
}) {
  const gridClass =
    variant === "dense"
      ? "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      : "grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3";

  return (
    <div className={gridClass}>
      {products.map((product) => (
        <ProductCard
          brandLabel={brandLabel}
          key={product.id}
          onOpen={() => onProductOpen(product)}
          product={product}
        />
      ))}
    </div>
  );
}
