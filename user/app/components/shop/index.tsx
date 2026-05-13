"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Product, ShopTheme } from "@/types";
import { safeImage, formatMoney } from "@/lib/utils";
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/ui/carousel";

export function ShopHero({
  theme,
  heroImages,
  /** Stretch with parent height (resizable shop hero panel). */
  fillContainer = false,
}: {
  theme: ShopTheme;
  heroImages?: string[];
  fillContainer?: boolean;
}) {
  const slides =
    heroImages && heroImages.length > 0 ? heroImages : [theme.heroImage];
  const slidesKey = slides.join("|");

  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const multiSlide = slides.length > 1;

  useEffect(() => {
    if (!carouselApi || !multiSlide) return;
    const intervalMs = 5000;
    const id = window.setInterval(() => {
      carouselApi.scrollNext();
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [carouselApi, multiSlide, slidesKey]);

  return (
    <section
      className={
        fillContainer
          ? "relative flex h-full min-h-[140px] flex-col overflow-hidden"
          : "relative min-h-[300px] overflow-hidden p-6 sm:p-10"
      }
    >
      <Carousel
        className={
          fillContainer ? "absolute inset-0 z-0 min-h-0" : "absolute inset-0"
        }
        opts={{ loop: multiSlide }}
        setApi={setCarouselApi}
      >
        <CarouselContent
          className={fillContainer ? "h-full -ml-0" : "h-full"}
          viewportClassName={fillContainer ? "h-full min-h-0" : undefined}
        >
          {slides.map((src, i) => (
            <CarouselItem
              className={
                fillContainer
                  ? "relative h-full min-h-0 basis-full !pl-0 p-0"
                  : "relative min-h-[300px] p-0"
              }
              key={`${src}-${i}`}
            >
              <Image
                alt={theme.name}
                className="object-cover"
                fill
                priority={i === 0}
                sizes="(max-width: 1280px) 100vw, 896px"
                src={safeImage(src)}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        {slides.length > 1 && (
          <>
            <CarouselPrevious className="left-3 border-white/20 bg-white/10 text-white shadow-sm backdrop-blur hover:bg-white/20" />
            <CarouselNext className="right-3 border-white/20 bg-white/10 text-white shadow-sm backdrop-blur hover:bg-white/20" />
          </>
        )}
      </Carousel>

      <div className="pointer-events-none absolute inset-0 z-[1] bg-black/45" />
      <div
        className={
          fillContainer
            ? "relative z-10 mt-auto flex max-w-2xl flex-col justify-end gap-1 p-4 text-white sm:p-6"
            : "relative flex min-h-[240px] max-w-2xl flex-col justify-end text-white"
        }
      >
        {theme.announcement && (
          <p className="mb-3 w-fit rounded-md bg-white/15 px-3 py-2 text-base font-medium backdrop-blur">
            {theme.announcement}
          </p>
        )}
        <h2 className="text-4xl font-semibold tracking-normal sm:text-5xl">
          {theme.name}
        </h2>
        <p className="mt-4 max-w-xl text-lg leading-8 text-white/85">
          {theme.tagline}
        </p>
      </div>
    </section>
  );
}

export function ProductCard({
  product,
  theme,
  mode,
  onAdd,
}: {
  product: Product;
  theme: ShopTheme;
  mode: "preview" | "shop";
  onAdd?: () => void;
}) {
  const effectivePrice = product.salePrice ?? product.price;
  const isOutOfStock = product.inventory === 0;
  const isLowStock = product.inventory > 0 && product.inventory < 5;

  return (
    <article
      className="overflow-hidden border border-zinc-200 bg-white shadow-sm"
      style={{ borderRadius: theme.radius }}
    >
      <div className="relative aspect-4/3 overflow-hidden bg-zinc-100">
        <Image
          alt={product.name}
          className="object-cover transition-transform duration-500 hover:scale-105"
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
          src={safeImage(product.image)}
        />
        {product.salePrice && (
          <div
            className="absolute left-3 top-3 rounded px-2 py-0.5 text-xs font-bold text-white"
            style={{ backgroundColor: theme.accentColor }}
          >
            SALE
          </div>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[1px]">
            <span className="rounded bg-white/90 px-3 py-1 text-sm font-semibold text-zinc-700">
              Out of stock
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
          {product.category}
        </p>
        <h4 className="mt-1 text-base font-semibold tracking-normal">
          {product.name}
        </h4>
        <p className="mt-1.5 text-sm leading-6 text-zinc-500">
          {product.description}
        </p>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold">
                {formatMoney(effectivePrice, theme.currency)}
              </p>
              {product.salePrice && (
                <p className="text-xs text-zinc-400 line-through">
                  {formatMoney(product.price, theme.currency)}
                </p>
              )}
            </div>
            {isLowStock && (
              <p className="mt-0.5 text-xs text-amber-600">
                Only {product.inventory} left
              </p>
            )}
          </div>

          {mode === "shop" && (
            <button
              className="rounded-md px-3 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={isOutOfStock}
              onClick={onAdd}
              style={{ backgroundColor: theme.primaryColor }}
              type="button"
            >
              Add
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export function ProductShelf({
  addToCart,
  mode,
  products,
  theme,
  title = "Products",
}: {
  addToCart?: (productId: string) => void;
  mode: "preview" | "shop";
  products: Product[];
  theme: ShopTheme;
  title?: string;
}) {
  const layoutClass =
    theme.layout === "editorial"
      ? "grid gap-4 md:grid-cols-2"
      : "grid gap-4 sm:grid-cols-2 xl:grid-cols-3";

  return (
    <section className="p-4 sm:p-5">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <p
            className="text-sm font-medium"
            style={{ color: theme.primaryColor }}
          >
            Collection
          </p>
          <h3 className="mt-1 text-xl font-semibold tracking-normal">
            {title}
          </h3>
        </div>
        <span className="text-sm opacity-55">{products.length} items</span>
      </div>

      {products.length > 0 ? (
        <div className={layoutClass}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              mode={mode}
              onAdd={() => addToCart?.(product.id)}
              product={product}
              theme={theme}
            />
          ))}
        </div>
      ) : (
        <p className="rounded-md border border-current/15 p-4 text-sm opacity-70">
          {mode === "preview"
            ? "Feature products in admin to preview them here."
            : "No products match your filter."}
        </p>
      )}
    </section>
  );
}

export {
  HeroShelfResizable,
  SHOP_PREVIEW_HOST_CLASS,
} from "./HeroShelfResizable";
