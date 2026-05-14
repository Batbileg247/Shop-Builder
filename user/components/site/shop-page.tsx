"use client";

import * as React from "react";

import { SITE_CATEGORIES, SITE_PRODUCTS } from "@/lib/site-mock-products";
import { cn } from "@/lib/utils";
import { useStore } from "@/context/store-context";
import { useStorefrontProducts } from "@/lib/use-storefront-products";

import { ProductCard } from "./product-card";

function parsePrice(v: string): number | null {
  const t = v.trim();
  if (t === "") return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function ShopPage() {
  const { storeSlug, basePath } = useStore();
  const { products: remoteProducts } = useStorefrontProducts(storeSlug);
  const products = remoteProducts ?? SITE_PRODUCTS;
  const categories = React.useMemo(() => {
    if (!remoteProducts) return SITE_CATEGORIES as unknown as string[];
    return ["All", ...Array.from(new Set(products.map((p) => p.category)))];
  }, [products, remoteProducts]);

  const [category, setCategory] = React.useState<string>("All");
  const [minPrice, setMinPrice] = React.useState("");
  const [maxPrice, setMaxPrice] = React.useState("");

  const filtered = React.useMemo(() => {
    const min = parsePrice(minPrice);
    const max = parsePrice(maxPrice);
    return products.filter((p) => {
      if (category !== "All" && p.category !== category) return false;
      if (min !== null && p.price < min) return false;
      if (max !== null && p.price > max) return false;
      return true;
    });
  }, [category, minPrice, maxPrice, products]);

  return (
    <div className="pv-storefront">
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-6 py-10 lg:flex-row lg:gap-10">
        <aside className="pv-card w-full shrink-0 p-[length:var(--pv-card-content-pad,1rem)] lg:w-56">
          <h2 className="border-b border-pv-divider pb-3 text-sm font-semibold uppercase tracking-wide text-pv-fg">
            Filters
          </h2>

          <div className="mt-4 space-y-2">
            <p className="text-xs font-medium text-pv-muted">Category</p>
            <ul className="flex flex-col gap-1.5">
              {categories.map((c) => (
                <li key={c}>
                  <button
                    type="button"
                    onClick={() => setCategory(c)}
                    className={cn(
                      "pv-chip w-full px-2 py-1.5 text-left text-sm font-medium transition-none",
                      category === c && "pv-chip-active",
                    )}
                  >
                    {c}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 space-y-2">
            <p className="text-xs font-medium text-pv-muted">Price range</p>
            <div className="flex gap-2">
              <input
                type="number"
                inputMode="numeric"
                min={0}
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="pv-input w-full px-2 py-1.5 text-sm tabular-nums placeholder:text-pv-muted"
              />
              <input
                type="number"
                inputMode="numeric"
                min={0}
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="pv-input w-full px-2 py-1.5 text-sm tabular-nums placeholder:text-pv-muted"
              />
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mb-6 border-b border-pv-divider pb-4">
            <h1 className="text-xl font-semibold tracking-tight text-pv-fg sm:text-2xl">
              Shop
            </h1>
            <p className="mt-1 text-sm text-pv-muted">
              {filtered.length} бараа
            </p>
          </div>

          {filtered.length === 0 ? (
            <p className="rounded-[length:var(--pv-radius)] border border-pv-divider bg-pv-empty px-4 py-8 text-center text-sm text-pv-muted">
              Шүүлтэнд тохирох бараа алга.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-[length:var(--pv-product-gap,1rem)] sm:grid-cols-2 lg:grid-cols-4">
              {filtered.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  href={`${basePath}/shop/${p.id}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
