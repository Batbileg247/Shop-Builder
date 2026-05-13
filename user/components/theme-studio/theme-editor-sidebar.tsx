"use client";

import Link from "next/link";
import { Box, Layers, Sparkles } from "lucide-react";

import { useShop } from "@/app/hooks/useShop";
import { BUILDER_PREVIEW_BASE } from "@/lib/site-paths";
import { useThemeStore, type ThemePresetId } from "@/stores/useThemeStore";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { cn } from "@/lib/utils";

const themes: { id: ThemePresetId; label: string; icon: typeof Layers }[] = [
  { id: "minimal", label: "Minimal", icon: Layers },
  { id: "glass", label: "Glass", icon: Sparkles },
  { id: "neumorph", label: "Neumorph", icon: Box },
];

export function ThemeEditorSidebar() {
  const preset = useThemeStore((s) => s.preset);
  const setPreset = useThemeStore((s) => s.setPreset);
  const heroTitle = useThemeStore((s) => s.heroTitle);
  const setHeroTitle = useThemeStore((s) => s.setHeroTitle);
  const heroImage = useThemeStore((s) => s.heroImage);
  const setHeroImage = useThemeStore((s) => s.setHeroImage);
  const primaryColor = useThemeStore((s) => s.primaryColor);
  const setPrimaryColor = useThemeStore((s) => s.setPrimaryColor);
  const backgroundColor = useThemeStore((s) => s.backgroundColor);
  const setBackgroundColor = useThemeStore((s) => s.setBackgroundColor);
  const textColor = useThemeStore((s) => s.textColor);
  const setTextColor = useThemeStore((s) => s.setTextColor);
  const radius = useThemeStore((s) => s.radius);
  const setRadius = useThemeStore((s) => s.setRadius);
  const cardContentPaddingRem = useThemeStore((s) => s.cardContentPaddingRem);
  const setCardContentPaddingRem = useThemeStore(
    (s) => s.setCardContentPaddingRem,
  );
  const productGridGapRem = useThemeStore((s) => s.productGridGapRem);
  const setProductGridGapRem = useThemeStore((s) => s.setProductGridGapRem);
  const resetTheme = useThemeStore((s) => s.reset);

  const shop = useShop();
  const cartCount = shop.cartItems.reduce((s, i) => s + i.quantity, 0);

  // Editor shell stays "minimal" (black/white) by default.
  // The preview changes with Style Selection; the editor panel itself remains minimal.
  const shellClass =
    "flex h-svh w-[350px] shrink-0 flex-col border-r border-zinc-200 bg-zinc-50 text-zinc-900";
  const headerBorderClass = "border-b border-zinc-200 px-5 py-4";
  const mutedLabelClass =
    "text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400";
  const titleClass = "mt-1 text-lg font-semibold tracking-tight text-zinc-900";
  const topLinkClass =
    "text-xs font-medium text-zinc-800 underline-offset-2 hover:text-zinc-900 hover:underline";
  const chipClass =
    "inline-flex items-center gap-2 rounded-sm border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-800 hover:outline hover:outline-1 hover:outline-zinc-300";
  const chipCountClass =
    "rounded-sm border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 font-semibold tabular-nums text-zinc-900";
  const sectionTitleClass =
    "text-xs font-semibold uppercase tracking-wide text-zinc-500";
  const fieldLabelClass = "text-sm font-medium text-zinc-800";
  const inputClass =
    "h-10 rounded-xl border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-400";
  const sliderClass =
    "h-2 w-full cursor-pointer appearance-none rounded-full bg-zinc-200 accent-zinc-900";
  const footerBorderClass = "shrink-0 border-t border-zinc-200 px-5 py-4";

  return (
    <aside className={shellClass} data-theme="minimal">
      <div className={headerBorderClass}>
        <p className={mutedLabelClass}>
          Live Theme Editor
        </p>
        <h1 className={titleClass}>
          Shop Builder
        </h1>
        <div className="mt-3 flex items-center justify-between gap-2">
          <Link
            href={`${BUILDER_PREVIEW_BASE}?cart=open`}
            className={chipClass}
          >
            Сагс
            {cartCount > 0 ? (
              <span className={chipCountClass}>
                {cartCount}
              </span>
            ) : (
              <span className="tabular-nums text-zinc-400">
                0
              </span>
            )}
          </Link>
          <Link
            href={BUILDER_PREVIEW_BASE}
            className={topLinkClass}
          >
            Дэлгүүр
          </Link>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6">
        <div className="flex flex-col gap-8">
        <section>
          <h2 className={sectionTitleClass}>
            Site Settings
          </h2>
          <div className="mt-4 space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="hero-title"
                className={fieldLabelClass}
              >
                Hero Title
              </label>
              <Input
                id="hero-title"
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                placeholder="Headline…"
                className={inputClass}
              />
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="hero-image"
                className={fieldLabelClass}
              >
                Hero Image URL
              </label>
              <Input
                id="hero-image"
                value={heroImage}
                onChange={(e) => setHeroImage(e.target.value)}
                placeholder="/background1.png or https://…"
                className={cn(inputClass, "font-mono text-xs")}
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className={sectionTitleClass}>
            Style Selection
          </h2>
          <div className="mt-4 flex flex-col gap-2">
            {themes.map(({ id, label, icon: Icon }) => {
              const active = preset === id;
              return (
                <Button
                  key={id}
                  type="button"
                  variant={active ? "default" : "outline"}
                  size="lg"
                  className={cn(
                    "h-11 w-full justify-start gap-2.5 rounded-xl",
                    preset === "minimal" && "border-zinc-200",
                    preset === "glass" && "border-white/15",
                    preset === "neumorph" && "border-indigo-200/70",
                    active &&
                      "border-zinc-900 bg-zinc-900 text-white hover:bg-zinc-800",
                  )}
                  onClick={() => setPreset(id)}
                >
                  <Icon className="size-4 shrink-0" aria-hidden />
                  {label}
                </Button>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className={sectionTitleClass}>
            Карт ба layout
          </h2>
          <div className="mt-4 space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <label
                  htmlFor="radius-theme"
                  className={fieldLabelClass}
                >
                  Булангийн радиус
                </label>
                <span className="text-xs tabular-nums text-zinc-500">
                  {radius}px
                </span>
              </div>
              <input
                type="range"
                min={2}
                max={40}
                step={1}
                value={radius}
                onChange={(e) => setRadius(Number.parseInt(e.target.value, 10))}
                className={cn(sliderClass, "disabled:cursor-not-allowed disabled:opacity-40")}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <label
                  htmlFor="card-pad"
                  className={fieldLabelClass}
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
                className={sliderClass}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <label
                  htmlFor="grid-gap"
                  className={fieldLabelClass}
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
                className={sliderClass}
              />
            </div>
          </div>
        </section>
        </div>
      </div>

      <div className={footerBorderClass}>
        <Button
          className="mb-3 w-full rounded-xl"
          onClick={() => resetTheme()}
          type="button"
          variant="outline"
        >
          Reset to default
        </Button>
      </div>
    </aside>
  );
}
