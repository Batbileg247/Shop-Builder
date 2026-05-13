"use client";

import * as React from "react";
import Link from "next/link";
import { Box, Layers, Sparkles } from "lucide-react";

import { useShop } from "@/app/hooks/useShop";
import { getAuthSession } from "@/lib/auth-session";
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

const base = BUILDER_PREVIEW_BASE;

function normalizeSlug(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function shortId() {
  return Math.random().toString(36).slice(2, 8);
}

export function ThemeEditorSidebar() {
  const preset = useThemeStore((s) => s.preset);
  const setPreset = useThemeStore((s) => s.setPreset);
  const heroTitle = useThemeStore((s) => s.heroTitle);
  const setHeroTitle = useThemeStore((s) => s.setHeroTitle);
  const heroImage = useThemeStore((s) => s.heroImage);
  const setHeroImage = useThemeStore((s) => s.setHeroImage);
  const shopName = useThemeStore((s) => s.shopName);
  const setShopName = useThemeStore((s) => s.setShopName);
  const heroAnnouncement = useThemeStore((s) => s.heroAnnouncement);
  const setHeroAnnouncement = useThemeStore((s) => s.setHeroAnnouncement);
  const radius = useThemeStore((s) => s.radius);
  const setRadius = useThemeStore((s) => s.setRadius);
  const cardContentPaddingRem = useThemeStore((s) => s.cardContentPaddingRem);
  const setCardContentPaddingRem = useThemeStore(
    (s) => s.setCardContentPaddingRem,
  );
  const productGridGapRem = useThemeStore((s) => s.productGridGapRem);
  const setProductGridGapRem = useThemeStore((s) => s.setProductGridGapRem);
  const primaryColor = useThemeStore((s) => s.primaryColor);
  const backgroundColor = useThemeStore((s) => s.backgroundColor);
  const textColor = useThemeStore((s) => s.textColor);
  const font = useThemeStore((s) => s.font);
  const resetTheme = useThemeStore((s) => s.reset);

  const shop = useShop();
  const cartCount = shop.cartItems.reduce((s, i) => s + i.quantity, 0);

  const [ownerId, setOwnerId] = React.useState("");
  const [storeName, setStoreName] = React.useState("My Store");
  const [storeSlug, setStoreSlug] = React.useState("");
  const [publishStatus, setPublishStatus] = React.useState<
    "idle" | "creating" | "created" | "error"
  >("idle");
  const [publishError, setPublishError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const s = getAuthSession();
    if (s?.user?.id) {
      setOwnerId((prev) => (prev.trim() ? prev : s.user.id));
    }
  }, []);

  async function handleCreateStore() {
    const platformBase = process.env.NEXT_PUBLIC_PLATFORM_API_URL?.trim();
    if (!platformBase) {
      setPublishError("NEXT_PUBLIC_PLATFORM_API_URL тохируулаагүй байна.");
      setPublishStatus("error");
      return;
    }
    if (!ownerId.trim()) {
      setPublishError("Owner ID (merchant user UUID) шаардлагатай.");
      setPublishStatus("error");
      return;
    }

    setPublishError(null);
    setPublishStatus("creating");

    const rawSlug = normalizeSlug(storeName) || `my-store-${shortId()}`;
    const slug = `${rawSlug}-${shortId()}`;

    try {
      const res = await fetch(`${platformBase}/stores`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ownerId: ownerId.trim(),
          name: storeName.trim() || "My Store",
          slug,
          themeConfig: {
            builderTheme: preset,
            heroTitle,
            heroImage,
            shopName,
            heroAnnouncement,
            primaryColor,
            backgroundColor,
            textColor,
            font,
            layout: {
              radiusPx: radius,
              cardContentPaddingRem,
              productGridGapRem,
            },
          },
        }),
      });

      const data = (await res.json().catch(() => null)) as {
        error?: string;
        slug?: string;
      } | null;
      if (!res.ok) {
        setPublishError(data?.error || `Алдаа (${res.status})`);
        setPublishStatus("error");
        return;
      }

      setStoreSlug(String(data?.slug ?? slug));
      setPublishStatus("created");
    } catch (e) {
      setPublishError(e instanceof Error ? e.message : "Сүлжээний алдаа");
      setPublishStatus("error");
    }
  }

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
        <p className={mutedLabelClass}>Live Theme Editor</p>
        <h1 className={titleClass}>Shop Builder</h1>
        <div className="mt-3 flex items-center justify-between gap-2">
          <Link href={`${base}?cart=open`} className={chipClass}>
            Сагс
            {cartCount > 0 ? (
              <span className={chipCountClass}>{cartCount}</span>
            ) : (
              <span className="tabular-nums text-zinc-400">0</span>
            )}
          </Link>
          <Link href={base} className={topLinkClass}>
            Дэлгүүр
          </Link>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6">
        <div className="flex flex-col gap-8">
          <section>
            <h2 className={sectionTitleClass}>Site Settings</h2>
            <div className="mt-4 space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="shop-name" className={fieldLabelClass}>
                  Shop name
                </label>
                <Input
                  id="shop-name"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  placeholder="Nomad Goods"
                  className={inputClass}
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="hero-announcement" className={fieldLabelClass}>
                  Announcement
                </label>
                <Input
                  id="hero-announcement"
                  value={heroAnnouncement}
                  onChange={(e) => setHeroAnnouncement(e.target.value)}
                  placeholder="Free delivery in Ulaanbaatar this week"
                  className={inputClass}
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="hero-title" className={fieldLabelClass}>
                  Tagline
                </label>
                <Input
                  id="hero-title"
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  placeholder="Subtitle under the shop name…"
                  className={inputClass}
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="hero-image" className={fieldLabelClass}>
                  Hero image URL
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
            <h2 className={sectionTitleClass}>Style Selection</h2>
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
            <h2 className={sectionTitleClass}>Карт ба layout</h2>
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
                  id="radius-theme"
                  type="range"
                  min={2}
                  max={40}
                  step={1}
                  value={radius}
                  onChange={(e) =>
                    setRadius(Number.parseInt(e.target.value, 10))
                  }
                  className={sliderClass}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <label htmlFor="card-pad" className={fieldLabelClass}>
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
                  <label htmlFor="grid-gap" className={fieldLabelClass}>
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

          <section>
            <h2 className={sectionTitleClass}>Өөрийн дэлгүүр (backend)</h2>
            <p className="text-xs text-zinc-500">
              Platform API дээр дэлгүүр үүсгээд public storefront нээнэ.
            </p>
            <div className="mt-4 space-y-3">
              <div className="space-y-1.5">
                <label htmlFor="owner-id" className={fieldLabelClass}>
                  Owner ID
                </label>
                <Input
                  id="owner-id"
                  value={ownerId}
                  onChange={(e) => setOwnerId(e.target.value)}
                  placeholder="merchant user UUID"
                  className={cn(inputClass, "font-mono text-xs")}
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="store-name" className={fieldLabelClass}>
                  Дэлгүүрийн нэр
                </label>
                <Input
                  id="store-name"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="My Store"
                  className={inputClass}
                />
              </div>

              <Button
                type="button"
                onClick={handleCreateStore}
                disabled={publishStatus === "creating"}
                className="h-11 w-full rounded-xl"
              >
                {publishStatus === "creating"
                  ? "Үүсгэж байна…"
                  : "Шинэ дэлгүүр үүсгэх"}
              </Button>

              {publishStatus === "created" && storeSlug ? (
                <div className="rounded-xl border border-zinc-200 bg-white p-3">
                  <p className="text-xs font-semibold text-zinc-900">
                    Дэлгүүр үүслээ
                  </p>
                  <p className="mt-1 break-all font-mono text-[11px] text-zinc-600">
                    slug: {storeSlug}
                  </p>
                  <Link
                    href={`/s/${encodeURIComponent(storeSlug)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex w-full items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-semibold text-zinc-900 hover:bg-zinc-100"
                  >
                    Public дэлгүүр нээх
                  </Link>
                </div>
              ) : null}

              {publishError ? (
                <p className="text-xs text-red-600">{publishError}</p>
              ) : null}
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
        <Link
          href={`${base}/panel`}
          className="block text-center text-xs font-medium text-zinc-600 underline-offset-2 hover:text-zinc-900 hover:underline"
        >
          Өмнөх builder (admin / storefront)
        </Link>
      </div>
    </aside>
  );
}
