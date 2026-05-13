"use client";

import * as React from "react";

import { useStore } from "@/context/store-context";
import { BUILDER_PREVIEW_BASE } from "@/lib/site-paths";
import { SITE_PRODUCTS } from "@/lib/site-mock-products";

import { ProductCard } from "./product-card";
import { SiteHeader } from "./site-header";

const base = BUILDER_PREVIEW_BASE;

const featured = SITE_PRODUCTS.slice(0, 6);

export function HomePage() {
  const { heroTitle, heroImage } = useStore();
  const [imgBroken, setImgBroken] = React.useState(false);

  React.useEffect(() => {
    setImgBroken(false);
  }, [heroImage]);

  return (
    <div className="pv-storefront">
      <SiteHeader />

      <section className="relative flex min-h-[420px] flex-col justify-end border-b border-pv-divider sm:min-h-[480px]">
        {!imgBroken && heroImage.trim() ? (
          // eslint-disable-next-line @next/next/no-img-element -- StoreContext URL/path
          <img
            src={heroImage}
            alt=""
            className="absolute inset-0 size-full object-cover"
            onError={() => setImgBroken(true)}
          />
        ) : (
          <div className="absolute inset-0 bg-pv-placeholder" aria-hidden />
        )}
        <div
          className="absolute inset-0"
          style={{ background: "var(--pv-hero-overlay)" }}
          aria-hidden
        />

        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
          <div className="pv-hero-panel max-w-xl px-6 py-8 sm:px-8 sm:py-10">
            <h1 className="text-balance text-3xl font-semibold tracking-tight text-pv-fg sm:text-4xl md:text-5xl">
              {heroTitle}
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-pv-muted sm:text-base">
              StoreContext-оос ирсэн hero — Theme Editor-оос өөрчилнө.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-14 sm:py-16">
        <div className="mb-8 flex flex-col gap-1 border-b border-pv-divider pb-6">
          <h2 className="text-lg font-semibold tracking-tight text-pv-fg sm:text-xl">
            Featured Products
          </h2>
          <p className="text-sm text-pv-muted">Сонгосон 6 бараа.</p>
        </div>
        <div className="grid grid-cols-1 gap-[length:var(--pv-product-gap,1rem)] sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              href={`${base}/shop/${p.id}`}
            />
          ))}
        </div>
      </section>

      <footer className="mt-auto border-t border-pv-divider py-8 text-center text-xs text-pv-muted">
        © {new Date().getFullYear()} Store
      </footer>
    </div>
  );
}
