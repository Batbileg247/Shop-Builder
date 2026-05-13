"use client";

import type { Product } from "@/types";
import { ProductCard } from "@/app/components/ecommerce/ProductCard";

export function ProductGrid({
  products,
  brandLabel,
  onProductOpen,
}: {
  products: Product[];
  brandLabel: string;
  onProductOpen: (product: Product) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
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
