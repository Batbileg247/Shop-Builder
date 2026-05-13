"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { BUILDER_PREVIEW_BASE } from "@/lib/site-paths";
import { formatMnt, getSiteProductById } from "@/lib/site-mock-products";
import { useCartStore } from "@/stores/cart-store";
import { cn } from "@/lib/utils";

import { SiteHeader } from "./site-header";

const base = BUILDER_PREVIEW_BASE;

export function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : params.id?.[0];
  const product = id ? getSiteProductById(id) : undefined;

  const [size, setSize] = React.useState<string | null>(null);
  const [color, setColor] = React.useState<string | null>(null);
  const addItem = useCartStore((s) => s.addItem);

  React.useEffect(() => {
    if (!product) return;
    setSize(product.sizes[0] ?? null);
    setColor(product.colors[0] ?? null);
  }, [product]);

  if (!product) {
    return (
      <div className="pv-storefront">
        <SiteHeader />
        <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-16">
          <p className="text-sm text-pv-muted">Бараа олдсонгүй.</p>
          <Link
            href={`${base}/shop`}
            className="mt-6 inline-block text-sm font-medium text-pv-fg underline-offset-2 hover:text-pv-link-hover hover:underline"
          >
            Дэлгүүр руу
          </Link>
        </main>
      </div>
    );
  }

  const canAdd = size && color;

  function handleAddToCart() {
    if (!product || !size || !color) return;
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      size,
      color,
      quantity: 1,
    });
    router.push(`${base}/cart`);
  }

  return (
    <div className="pv-storefront">
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8 sm:py-10">
        <nav className="mb-8 text-xs text-pv-muted">
          <Link
            href={`${base}/shop`}
            className="font-medium text-pv-fg hover:underline"
          >
            Shop
          </Link>
          <span className="mx-2 text-pv-muted">/</span>
          <span className="text-pv-fg">{product.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="min-w-0">
            <div className="pv-visual aspect-square w-full">
              <div className="flex size-full items-center justify-center bg-pv-placeholder">
                <span className="text-6xl font-semibold tabular-nums text-pv-muted sm:text-7xl">
                  {product.name.slice(0, 1)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex min-w-0 flex-col gap-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-pv-muted">
                {product.category}
              </p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-pv-fg sm:text-3xl">
                {product.name}
              </h1>
              <p className="mt-4 text-2xl font-semibold tabular-nums tracking-tight text-pv-fg">
                {formatMnt(product.price)} ₮
              </p>
            </div>

            <p className="text-sm leading-relaxed text-pv-muted">
              {product.description}
            </p>

            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-pv-muted">
                Size
              </p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={cn(
                      "pv-chip px-3 py-2 text-sm font-medium transition-none",
                      size === s && "pv-chip-active",
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-pv-muted">
                Color
              </p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={cn(
                      "pv-chip px-3 py-2 text-sm font-medium transition-none",
                      color === c && "pv-chip-active",
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-2 flex flex-col gap-3 border-t border-pv-divider pt-6">
              <button
                type="button"
                disabled={!canAdd}
                onClick={handleAddToCart}
                className="pv-btn-primary px-6 py-3 text-sm font-semibold tracking-tight"
              >
                Add to Cart
              </button>
              <Link
                href={`${base}/shop`}
                className="text-center text-sm text-pv-muted underline-offset-2 hover:text-pv-fg hover:underline"
              >
                Бусад бараа үзэх
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
