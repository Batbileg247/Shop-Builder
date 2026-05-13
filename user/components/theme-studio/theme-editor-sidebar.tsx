"use client";

import Link from "next/link";
import { Box, Layers, Sparkles } from "lucide-react";

import { useStore, type ThemeId } from "@/context/store-context";
import { BUILDER_PREVIEW_BASE } from "@/lib/site-paths";
import { selectCartItemCount, useCartStore } from "@/stores/cart-store";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { cn } from "@/lib/utils";

const themes: { id: ThemeId; label: string; icon: typeof Layers }[] = [
  { id: "minimal", label: "Minimal", icon: Layers },
  { id: "glass", label: "Glass", icon: Sparkles },
  { id: "neumorph", label: "Neumorph", icon: Box },
];

export function ThemeEditorSidebar() {
  const {
    currentTheme,
    setCurrentTheme,
    heroTitle,
    setHeroTitle,
    heroImage,
    setHeroImage,
    cardRadiusFollowsTheme,
    setCardRadiusFollowsTheme,
    cardRadiusPx,
    setCardRadiusPx,
    cardContentPaddingRem,
    setCardContentPaddingRem,
    productGridGapRem,
    setProductGridGapRem,
  } = useStore();
  const cartCount = useCartStore(selectCartItemCount);

  return (
    <aside className="flex h-svh w-[350px] shrink-0 flex-col border-r border-zinc-200 bg-zinc-50">
      <div className="border-b border-zinc-200 px-5 py-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
          Live Theme Editor
        </p>
        <h1 className="mt-1 text-lg font-semibold tracking-tight text-zinc-900">
          Shop Builder
        </h1>
        <div className="mt-3 flex items-center justify-between gap-2">
          <Link
            href={`${BUILDER_PREVIEW_BASE}/cart`}
            className="inline-flex items-center gap-2 rounded-sm border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-800 hover:outline hover:outline-1 hover:outline-zinc-300"
          >
            Сагс
            {cartCount > 0 ? (
              <span className="rounded-sm border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 font-semibold tabular-nums text-zinc-900">
                {cartCount}
              </span>
            ) : (
              <span className="tabular-nums text-zinc-400">0</span>
            )}
          </Link>
          <Link
            href={`${BUILDER_PREVIEW_BASE}/shop`}
            className="text-xs font-medium text-zinc-600 underline-offset-2 hover:text-zinc-900 hover:underline"
          >
            Дэлгүүр
          </Link>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6">
        <div className="flex flex-col gap-8">
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Site Settings
          </h2>
          <div className="mt-4 space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="hero-title"
                className="text-sm font-medium text-zinc-800"
              >
                Hero Title
              </label>
              <Input
                id="hero-title"
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                placeholder="Headline…"
                className="h-10 rounded-xl border-zinc-200 bg-white"
              />
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="hero-image"
                className="text-sm font-medium text-zinc-800"
              >
                Hero Image URL
              </label>
              <Input
                id="hero-image"
                value={heroImage}
                onChange={(e) => setHeroImage(e.target.value)}
                placeholder="/background1.png or https://…"
                className="h-10 rounded-xl border-zinc-200 bg-white font-mono text-xs"
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Style Selection
          </h2>
          <div className="mt-4 flex flex-col gap-2">
            {themes.map(({ id, label, icon: Icon }) => {
              const active = currentTheme === id;
              return (
                <Button
                  key={id}
                  type="button"
                  variant={active ? "default" : "outline"}
                  size="lg"
                  className={cn(
                    "h-11 w-full justify-start gap-2.5 rounded-xl border-zinc-200",
                    active &&
                      "border-zinc-900 bg-zinc-900 text-white hover:bg-zinc-800",
                  )}
                  onClick={() => setCurrentTheme(id)}
                >
                  <Icon className="size-4 shrink-0" aria-hidden />
                  {label}
                </Button>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Карт ба layout
          </h2>
          <div className="mt-4 space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <label
                  htmlFor="radius-theme"
                  className="text-sm font-medium text-zinc-800"
                >
                  Булангийн радиус
                </label>
                <span className="text-xs tabular-nums text-zinc-500">
                  {cardRadiusFollowsTheme ? "theme" : `${cardRadiusPx}px`}
                </span>
              </div>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-600">
                <input
                  id="radius-theme"
                  type="checkbox"
                  checked={cardRadiusFollowsTheme}
                  onChange={(e) => setCardRadiusFollowsTheme(e.target.checked)}
                  className="size-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-400"
                />
                Theme-ийн default (Glass/Neumorph/Minimal)
              </label>
              <input
                type="range"
                min={2}
                max={40}
                step={1}
                value={cardRadiusPx}
                disabled={cardRadiusFollowsTheme}
                onChange={(e) =>
                  setCardRadiusPx(Number.parseInt(e.target.value, 10))
                }
                className={cn(
                  "h-2 w-full cursor-pointer appearance-none rounded-full bg-zinc-200 accent-zinc-900 disabled:cursor-not-allowed disabled:opacity-40",
                )}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <label
                  htmlFor="card-pad"
                  className="text-sm font-medium text-zinc-800"
                >
                  Картын доторх зай
                </label>
                <span className="text-xs tabular-nums text-zinc-500">
                  {cardContentPaddingRem.toFixed(2)}rem
                </span>
              </div>
              <input
                id="card-pad"
                type="range"
                min={0.5}
                max={2}
                step={0.0625}
                value={cardContentPaddingRem}
                onChange={(e) =>
                  setCardContentPaddingRem(Number.parseFloat(e.target.value))
                }
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-zinc-200 accent-zinc-900"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <label
                  htmlFor="grid-gap"
                  className="text-sm font-medium text-zinc-800"
                >
                  Торын хоорондын зай
                </label>
                <span className="text-xs tabular-nums text-zinc-500">
                  {productGridGapRem.toFixed(2)}rem
                </span>
              </div>
              <input
                id="grid-gap"
                type="range"
                min={0.375}
                max={2.5}
                step={0.0625}
                value={productGridGapRem}
                onChange={(e) =>
                  setProductGridGapRem(Number.parseFloat(e.target.value))
                }
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-zinc-200 accent-zinc-900"
              />
            </div>
          </div>
        </section>
        </div>
      </div>

      <div className="shrink-0 border-t border-zinc-200 px-5 py-4">
        <Link
          href={`${BUILDER_PREVIEW_BASE}/panel`}
          className="text-xs font-medium text-zinc-600 underline-offset-2 hover:text-zinc-900 hover:underline"
        >
          Өмнөх builder (admin / storefront)
        </Link>
      </div>
    </aside>
  );
}
