"use client";

import * as React from "react";

import type { Product } from "@/types";
import { ProductDetail } from "../../app/components/ecommerce/ProductDetail";

export function ShopProductDetailModal({
  open,
  product,
  onClose,
  onAddToCart,
}: {
  open: boolean;
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}) {
  return (
    <ProductDetail
      brandLabel={product?.category ?? "Shop"}
      onAddToCart={onAddToCart}
      onClose={onClose}
      open={open}
      product={product}
    />
  );
}

