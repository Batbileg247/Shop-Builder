"use client";

import { useCallback, useEffect, useId, useState } from "react";
import Image from "next/image";
import type { Product } from "@/types";
import { cn, safeImage } from "@/lib/utils";
import { Button } from "@/ui/button";
import { formatStorefrontPrice } from "@/app/components/ecommerce/storefront-price";
import { StarRating } from "@/app/components/ecommerce/StarRating";
import { XIcon } from "lucide-react";

const SIZES = ["M", "L", "XL", "XXL"] as const;
const COLORS = [
  { id: "blue", label: "Blue", swatch: "bg-sky-300" },
  { id: "black", label: "Black", swatch: "bg-zinc-900" },
  { id: "pink", label: "Pink", swatch: "bg-pink-200" },
] as const;

function pseudoReviews(productId: string) {
  let h = 0;
  for (let i = 0; i < productId.length; i++) h += productId.charCodeAt(i);
  return { count: 1 + (h % 40), rating: 3.5 + (h % 15) / 10 };
}

export function ProductDetail({
  open,
  product,
  brandLabel,
  onClose,
  onAddToCart,
}: {
  open: boolean;
  product: Product | null;
  brandLabel: string;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}) {
  const titleId = useId();
  const [size, setSize] = useState<(typeof SIZES)[number]>("M");
  const [colorId, setColorId] = useState<(typeof COLORS)[number]["id"]>("blue");
  const [qty, setQty] = useState(1);
  const [activeThumb, setActiveThumb] = useState(0);

  useEffect(() => {
    if (open && product) {
      setSize("M");
      setColorId("blue");
      setQty(1);
      setActiveThumb(0);
    }
  }, [open, product?.id]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, handleClose]);

  if (!product) return null;

  const effective = product.salePrice ?? product.price;
  const { count, rating } = pseudoReviews(product.id);
  const pctOff =
    product.salePrice != null
      ? Math.round((1 - product.salePrice / product.price) * 100)
      : 0;
  const thumbs = [0, 1, 2, 3, 4, 5].map((i) => ({
    key: i,
    src: product.image,
  }));

  return (
    <div
      aria-labelledby={titleId}
      aria-modal="true"
      className={cn(
        "fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto bg-black/45 p-3 transition-opacity duration-200 sm:p-6",
        open ? "opacity-100" : "pointer-events-none opacity-0",
      )}
      role="dialog"
    >
      <button
        aria-label="Close product"
        className="fixed inset-0 cursor-default"
        onClick={handleClose}
        tabIndex={-1}
        type="button"
      />
      <div
        className={cn(
          "relative z-10 mt-4 mb-10 w-full max-w-6xl rounded-lg bg-white shadow-2xl transition-transform duration-200",
          open ? "translate-y-0" : "translate-y-3",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 z-20 rounded-full bg-white/90 p-2 text-zinc-700 shadow ring-1 ring-black/10 transition hover:bg-zinc-50"
          onClick={handleClose}
          type="button"
        >
          <XIcon className="size-5" />
        </button>

        <div className="grid gap-8 p-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:p-10">
          <div className="flex gap-4">
            <div className="flex shrink-0 flex-col gap-2">
              {thumbs.map((t, i) => (
                <button
                  className={cn(
                    "relative size-14 overflow-hidden rounded-md ring-2 ring-transparent transition sm:size-16",
                    activeThumb === i && "ring-black",
                  )}
                  key={t.key}
                  onClick={() => setActiveThumb(i)}
                  type="button"
                >
                  <Image
                    alt=""
                    className="object-cover"
                    fill
                    sizes="64px"
                    src={safeImage(t.src)}
                  />
                </button>
              ))}
            </div>
            <div className="relative min-h-[280px] flex-1 overflow-hidden rounded-lg bg-zinc-100 sm:min-h-[420px]">
              <Image
                alt={product.name}
                className="object-cover"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                src={safeImage(product.image)}
              />
            </div>
          </div>

          <div className="flex min-w-0 flex-col gap-5">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                {brandLabel}
              </p>
              <div className="mt-1 flex items-start justify-between gap-3">
                <h2
                  className="font-serif text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl"
                  id={titleId}
                >
                  {product.name}
                </h2>
                <button
                  aria-label="Save to wishlist"
                  className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 transition hover:border-zinc-400"
                  type="button"
                >
                  ☆
                </button>
              </div>
              <div className="mt-2 flex items-center gap-2 text-sm">
                <StarRating className="text-base" rating={Math.min(5, rating)} />
                <span className="text-zinc-500">({count})</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="text-2xl font-semibold text-zinc-900">
                {formatStorefrontPrice(effective)}
              </span>
              {product.salePrice != null && (
                <>
                  <span className="text-lg text-zinc-400 line-through">
                    {formatStorefrontPrice(product.price)}
                  </span>
                  <span className="rounded bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-700">
                    SAVE {pctOff}%
                  </span>
                </>
              )}
            </div>

            <p className="flex items-center gap-2 text-sm text-zinc-600">
              <span aria-hidden>👁</span>
              24 people are viewing this right now
            </p>

            <div className="rounded-md border border-red-100 bg-red-50/80 px-3 py-2 text-sm text-red-800">
              Hurry up! Sale ends in:{" "}
              <span className="font-mono font-semibold">00 : 05 : 59 : 47</span>
            </div>

            <div>
              <p className="text-sm font-medium text-zinc-800">
                Only {product.inventory} item(s) left in stock!
              </p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-red-500 to-zinc-300"
                  style={{
                    width: `${Math.min(100, Math.max(8, (product.inventory / 20) * 100))}%`,
                  }}
                />
              </div>
            </div>

            <p className="text-sm leading-relaxed text-zinc-600">
              {product.description}
            </p>

            <div>
              <p className="text-sm font-medium text-zinc-800">Size: {size}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {SIZES.map((s) => (
                  <button
                    className={cn(
                      "min-w-10 rounded border px-3 py-2 text-sm font-medium transition",
                      size === s
                        ? "border-black bg-black text-white"
                        : "border-zinc-300 bg-white text-zinc-800 hover:border-zinc-500",
                    )}
                    key={s}
                    onClick={() => setSize(s)}
                    type="button"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-zinc-800">
                Color:{" "}
                {COLORS.find((c) => c.id === colorId)?.label ?? "Blue"}
              </p>
              <div className="mt-2 flex gap-2">
                {COLORS.map((c) => (
                  <button
                    aria-label={c.label}
                    className={cn(
                      "size-9 rounded-full border-2 border-transparent p-0.5 ring-offset-2 transition",
                      colorId === c.id && "border-black",
                    )}
                    key={c.id}
                    onClick={() => setColorId(c.id)}
                    type="button"
                  >
                    <span
                      className={cn(
                        "block size-full rounded-full ring-1 ring-black/10",
                        c.swatch,
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-zinc-800">Qty</span>
              <div className="flex items-center rounded-md border border-zinc-300">
                <button
                  className="px-3 py-2 text-lg leading-none text-zinc-600 transition hover:bg-zinc-50 disabled:opacity-40"
                  disabled={qty <= 1}
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  type="button"
                >
                  −
                </button>
                <span className="min-w-8 text-center text-sm font-semibold">
                  {qty}
                </span>
                <button
                  className="px-3 py-2 text-lg leading-none text-zinc-600 transition hover:bg-zinc-50 disabled:opacity-40"
                  disabled={qty >= product.inventory}
                  onClick={() =>
                    setQty((q) => Math.min(product.inventory, q + 1))
                  }
                  type="button"
                >
                  +
                </button>
              </div>
            </div>

            <Button
              className="h-11 w-full max-w-md border border-black bg-white text-black hover:bg-zinc-50"
              onClick={() => {
                onAddToCart(product, qty);
              }}
              variant="outline"
            >
              Add to cart
            </Button>

            <div className="flex flex-wrap gap-4 text-sm text-zinc-500">
              <span>Compare</span>
              <span>Ask a question</span>
              <span>Share</span>
            </div>

            <div className="mt-2 space-y-2 border-t border-zinc-100 pt-4 text-sm text-zinc-600">
              <p>🚚 Estimated Delivery: Jul 30 – Aug 03</p>
              <p>📦 Free Shipping &amp; Returns on orders over $75</p>
            </div>

            <div className="rounded-md bg-zinc-50 px-3 py-2 text-center text-xs text-zinc-500">
              Guarantee safe &amp; secure checkout — Visa · Mastercard · Amex ·
              PayPal
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
