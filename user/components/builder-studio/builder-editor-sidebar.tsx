"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Box, Layers, Sparkles } from "lucide-react";

import { useShop } from "@/app/hooks/useShop";
import { useDashboard } from "@/context/DashboardContext";
import { getAuthSession } from "@/lib/auth-session";
import { PATHS } from "@/lib/site-paths";
import { buildHeroCarouselUrls } from "@/lib/shop-theme";
import { useThemeStore, type ThemePresetId } from "@/stores/useThemeStore";
import { Button } from "@/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarProvider,
  SidebarSeparator,
} from "@/ui/sidebar";
import { cn } from "@/lib/utils";

const themes: { id: ThemePresetId; label: string; icon: typeof Layers }[] = [
  { id: "minimal", label: "Minimal", icon: Layers },
  { id: "glass", label: "Glass", icon: Sparkles },
  { id: "neumorph", label: "Neumorph", icon: Box },
];

const base = PATHS.builder;

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

export function BuilderEditorSidebar() {
  const { activeShop } = useDashboard();
  const brand = activeShop.brandColor;
  const accent = activeShop.accentColor;

  const preset = useThemeStore((s) => s.preset);
  const setPreset = useThemeStore((s) => s.setPreset);
  const heroTitle = useThemeStore((s) => s.heroTitle);
  const setHeroTitle = useThemeStore((s) => s.setHeroTitle);
  const heroImage = useThemeStore((s) => s.heroImage);
  const setHeroImage = useThemeStore((s) => s.setHeroImage);
  const heroGallery = useThemeStore((s) => s.heroGallery);
  const addHeroGalleryImage = useThemeStore((s) => s.addHeroGalleryImage);
  const removeHeroGalleryAt = useThemeStore((s) => s.removeHeroGalleryAt);
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

  const heroSlideCount = React.useMemo(
    () => buildHeroCarouselUrls({ heroImage, heroGallery }).length,
    [heroImage, heroGallery],
  );

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

    const slides = buildHeroCarouselUrls({ heroImage, heroGallery }).length;
    if (slides < 3) {
      setPublishError(
        "Hero зураг дор хаяж 3 шаардлагатай (primary + gallery нийлбэрээр).",
      );
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
            heroGallery,
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

  const sectionLabelClass =
    "text-xs font-bold uppercase tracking-[0.16em] text-slate-400";
  const fieldLabelClass = "text-sm font-bold text-slate-600";
  const inputClass =
    "h-11 rounded-2xl border-slate-100 bg-slate-50 text-sm font-semibold text-slate-900 shadow-none placeholder:text-slate-400 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-slate-200";

  const sliderStyle = React.useMemo(
    () => ({ accentColor: brand } as React.CSSProperties),
    [brand],
  );

  const headerBg = React.useMemo(
    () =>
      ({
        background: `linear-gradient(145deg, ${accent} 0%, #ffffff 42%, #f8fafc 100%)`,
      }) as React.CSSProperties,
    [accent],
  );

  const sliderClass =
    "h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200/90";

  return (
    <SidebarProvider
      defaultOpen
      sidebarLabel="Live theme editor"
      className="flex h-full min-h-0 w-full min-w-0 shrink-0 flex-col"
    >
      <Sidebar
        collapsible="none"
        className="h-full min-h-0 border-r border-slate-100 bg-white text-slate-900 shadow-[4px_0_28px_rgba(15,23,42,0.06)]"
        data-theme="minimal"
      >
        <SidebarHeader
          className="border-b border-slate-100 px-3 pb-3 pt-3"
          style={headerBg}
        >
          <div className="flex items-center gap-3 px-1">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-xs font-black text-white shadow-lg shadow-slate-200/80"
              style={{ backgroundColor: brand }}
            >
              TS
            </div>
            <div className="min-w-0">
              <p className={sectionLabelClass}>Live theme editor</p>
              <p className="mt-0.5 truncate text-base font-black tracking-tight text-slate-950">
                Shop Builder
              </p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between gap-2 px-1">
            <Link
              href={`${base}?cart=open`}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/80 bg-white/90 px-3 py-2 text-xs font-bold text-slate-800 shadow-sm backdrop-blur-sm transition hover:bg-white"
              style={{ boxShadow: `0 8px 20px ${brand}22` }}
            >
              Сагс
              {cartCount > 0 ? (
                <span
                  className="rounded-xl px-2 py-0.5 text-[11px] font-black tabular-nums text-white"
                  style={{ backgroundColor: brand }}
                >
                  {cartCount}
                </span>
              ) : (
                <span className="tabular-nums text-slate-400">0</span>
              )}
            </Link>
            <Link
              href={base}
              className="rounded-2xl px-3 py-2 text-xs font-bold text-slate-700 underline-offset-2 transition hover:bg-white/80 hover:text-slate-950 hover:underline"
            >
              Дэлгүүр
            </Link>
          </div>
        </SidebarHeader>

        <SidebarContent className="bg-[#f8f9fe]/80">
          <SidebarGroup>
            <SidebarGroupLabel className={sectionLabelClass}>
              Site settings
            </SidebarGroupLabel>
            <SidebarGroupContent className="space-y-3">
              <div className="space-y-1.5">
                <label htmlFor="shop-name" className={fieldLabelClass}>
                  Shop name
                </label>
                <SidebarInput
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
                <SidebarInput
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
                <SidebarInput
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
                <SidebarInput
                  id="hero-image"
                  value={heroImage}
                  onChange={(e) => setHeroImage(e.target.value)}
                  placeholder="Optional: https://… or /path or leave empty if uploading"
                  className={cn(inputClass, "font-mono text-xs")}
                />
              </div>
              <div className="space-y-1.5">
                <span className={fieldLabelClass}>Primary hero upload</span>
                <input
                  accept="image/*"
                  className="block w-full text-xs text-slate-500 file:mr-3 file:rounded-2xl file:border file:border-slate-200 file:bg-white file:px-3 file:py-2 file:text-xs file:font-bold file:text-slate-800"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    e.target.value = "";
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () =>
                      setHeroImage(String(reader.result ?? ""));
                    reader.readAsDataURL(file);
                  }}
                  type="file"
                />
              </div>
              <div className="space-y-2">
                <span className={fieldLabelClass}>
                  Hero gallery (extra slides)
                </span>
                <div className="flex flex-wrap gap-2">
                  {heroGallery.map((url, index) => (
                    <div
                      className="relative size-14 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                      key={`${url.slice(0, 48)}-${index}`}
                    >
                      <Image
                        alt=""
                        className="object-cover"
                        fill
                        sizes="56px"
                        src={url}
                        unoptimized
                      />
                      <button
                        className="absolute inset-0 flex items-center justify-center bg-black/50 text-[10px] font-bold text-white opacity-0 transition hover:opacity-100"
                        onClick={() => removeHeroGalleryAt(index)}
                        type="button"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                <input
                  accept="image/*"
                  className="block w-full text-xs text-slate-500 file:mr-3 file:rounded-2xl file:border file:border-slate-200 file:bg-white file:px-3 file:py-2 file:text-xs file:font-bold file:text-slate-800"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    e.target.value = "";
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () =>
                      addHeroGalleryImage(String(reader.result ?? ""));
                    reader.readAsDataURL(file);
                  }}
                  type="file"
                />
              </div>
              <div
                className="rounded-2xl border border-slate-100 bg-white px-3 py-2.5 shadow-sm"
                style={{ borderLeftWidth: 4, borderLeftColor: brand }}
              >
                <p className="text-xs font-bold text-slate-900">
                  Hero slides: {heroSlideCount} / 3 minimum
                </p>
                {heroSlideCount < 3 ? (
                  <p className="mt-1 text-xs font-medium text-amber-800 dark:text-amber-200">
                    Primary + gallery together must reach three distinct images
                    for the storefront demo and publishing.
                  </p>
                ) : (
                  <p className="mt-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                    Ready: carousel has enough slides.
                  </p>
                )}
              </div>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator className="bg-slate-200/90" />

          <SidebarGroup>
            <SidebarGroupLabel className={sectionLabelClass}>
              Style selection
            </SidebarGroupLabel>
            <SidebarGroupContent className="space-y-2 pt-1">
              {themes.map(({ id, label, icon: Icon }) => {
                const active = preset === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setPreset(id)}
                    className={cn(
                      "flex h-11 w-full items-center gap-2.5 rounded-2xl px-4 text-sm font-bold transition",
                      active
                        ? "bg-slate-950 text-white shadow-[0_12px_28px_rgba(15,23,42,0.18)]"
                        : "bg-white text-slate-600 shadow-sm ring-1 ring-slate-100 hover:bg-slate-50 hover:text-slate-900",
                    )}
                  >
                    <span
                      className="flex size-8 items-center justify-center rounded-xl"
                      style={
                        active
                          ? {
                              backgroundColor: "rgba(255,255,255,0.2)",
                              color: "#ffffff",
                            }
                          : { backgroundColor: accent, color: brand }
                      }
                    >
                      <Icon className="size-4 shrink-0" aria-hidden />
                    </span>
                    {label}
                  </button>
                );
              })}
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator className="bg-slate-200/90" />

          <SidebarGroup>
            <SidebarGroupLabel className={sectionLabelClass}>
              Карт ба layout
            </SidebarGroupLabel>
            <SidebarGroupContent className="space-y-5 pt-1">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <label
                    htmlFor="radius-theme"
                    className={fieldLabelClass}
                  >
                    Булангийн радиус
                  </label>
                  <span className="text-xs tabular-nums font-semibold text-slate-500">
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
                  style={sliderStyle}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <label htmlFor="card-pad" className={fieldLabelClass}>
                    Картын доторх зай
                  </label>
                  <span className="text-xs tabular-nums font-semibold text-slate-500">
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
                  style={sliderStyle}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <label htmlFor="grid-gap" className={fieldLabelClass}>
                    Торын хоорондын зай
                  </label>
                  <span className="text-xs tabular-nums font-semibold text-slate-500">
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
                  style={sliderStyle}
                />
              </div>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator className="bg-slate-200/90" />

          <SidebarGroup>
            <SidebarGroupLabel className={sectionLabelClass}>
              Өөрийн дэлгүүр (backend)
            </SidebarGroupLabel>
            <SidebarGroupContent className="space-y-3 pt-1">
              <p className="text-xs font-medium text-slate-500">
                Platform API дээр дэлгүүр үүсгээд public storefront нээнэ.
              </p>
              <div className="space-y-1.5">
                <label htmlFor="owner-id" className={fieldLabelClass}>
                  Owner ID
                </label>
                <SidebarInput
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
                <SidebarInput
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
                className="h-11 w-full rounded-2xl text-sm font-black text-white shadow-lg transition hover:opacity-90 disabled:opacity-60"
                style={{
                  backgroundColor: brand,
                  boxShadow: `0 14px 28px ${brand}44`,
                }}
              >
                {publishStatus === "creating"
                  ? "Үүсгэж байна…"
                  : "Шинэ дэлгүүр үүсгэх"}
              </Button>

              {publishStatus === "created" && storeSlug ? (
                <div className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm ring-1 ring-slate-100">
                  <p className="text-xs font-bold text-slate-900">
                    Дэлгүүр үүслээ
                  </p>
                  <p className="mt-1 break-all font-mono text-[11px] text-slate-500">
                    slug: {storeSlug}
                  </p>
                  <Link
                    href={`/s/${encodeURIComponent(storeSlug)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-900 transition hover:bg-white"
                    style={{ borderColor: brand, color: brand }}
                  >
                    Public дэлгүүр нээх
                  </Link>
                </div>
              ) : null}

              {publishError ? (
                <p className="text-xs font-semibold text-red-600">{publishError}</p>
              ) : null}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-slate-100 bg-white px-2 pb-3 pt-2">
          <Button
            className="mb-2 h-11 w-full rounded-2xl border-slate-200 font-bold text-slate-700"
            onClick={() => resetTheme()}
            type="button"
            variant="outline"
          >
            Reset to default
          </Button>
          <Link
            href={PATHS.adminOverview}
            className="block rounded-xl py-2 text-center text-xs font-bold text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
          >
            Shop settings ({PATHS.adminShop})
          </Link>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
}
