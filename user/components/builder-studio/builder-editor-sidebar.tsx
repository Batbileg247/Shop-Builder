"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Box, Layers, Sparkles } from "lucide-react";

import { useShop } from "@/app/hooks/useShop";
import { useDashboard } from "@/context/DashboardContext";
import { getAuthSession } from "@/lib/auth-session";
import { patchAdminStore } from "@/lib/admin-api";
import { postPlatformStore, type PlatformStoreCreated } from "@/lib/platform-stores";
import { PATHS, storefrontNavBase } from "@/lib/site-paths";
import { buildSiteThemePersisted } from "@/lib/site-theme-config";
import { buildHeroCarouselUrls } from "@/lib/shop-theme";
import { getMerchantBaseUrl, resolveThemeImageUrlsForStorage, uploadImageViaMerchantApi } from "@/lib/storefront-api";
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
import { cn, normalizeMerchantSlugBase } from "@/lib/utils";

const themes: { id: ThemePresetId; label: string; icon: typeof Layers }[] = [
  { id: "minimal", label: "Minimal", icon: Layers },
  { id: "glass", label: "Glass", icon: Sparkles },
  { id: "neumorph", label: "Neumorph", icon: Box },
];

export function BuilderEditorSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const isCreateFlow =
    pathname === PATHS.builderCreate ||
    (pathname?.startsWith(`${PATHS.builderCreate}/`) ?? false);
  const isUpdateFlow =
    pathname === PATHS.builderUpdate ||
    (pathname?.startsWith(`${PATHS.builderUpdate}/`) ?? false);

  const base = storefrontNavBase(pathname);
  const { activeShop, refreshDashboard, reloadShops, switchShop } =
    useDashboard();

  const preset = useThemeStore((s) => s.preset);
  const setPreset = useThemeStore((s) => s.setPreset);

  const heroTitle = useThemeStore((s) => s.heroTitle);
  const setHeroTitle = useThemeStore((s) => s.setHeroTitle);

  const setHeroImage = useThemeStore((s) => s.setHeroImage);
  const setHeroGallery = useThemeStore((s) => s.setHeroGallery);

  const heroGallery = useThemeStore((s) => s.heroGallery);
  const addHeroGalleryImage = useThemeStore((s) => s.addHeroGalleryImage);
  const removeHeroGalleryAt = useThemeStore((s) => s.removeHeroGalleryAt);

  const shopName = useThemeStore((s) => s.shopName);
  const setShopName = useThemeStore((s) => s.setShopName);

  const radius = useThemeStore((s) => s.radius);
  const setRadius = useThemeStore((s) => s.setRadius);

  const cardContentPaddingRem = useThemeStore((s) => s.cardContentPaddingRem);

  const setCardContentPaddingRem = useThemeStore(
    (s) => s.setCardContentPaddingRem,
  );

  const productGridGapRem = useThemeStore((s) => s.productGridGapRem);

  const setProductGridGapRem = useThemeStore((s) => s.setProductGridGapRem);

  const heroImageHeightPx = useThemeStore((s) => s.heroImageHeightPx);
  const setHeroImageHeightPx = useThemeStore((s) => s.setHeroImageHeightPx);

  const previewProductCardBasisRem = useThemeStore(
    (s) => s.previewProductCardBasisRem,
  );
  const setPreviewProductCardBasisRem = useThemeStore(
    (s) => s.setPreviewProductCardBasisRem,
  );

  const primaryColor = useThemeStore((s) => s.primaryColor);
  const backgroundColor = useThemeStore((s) => s.backgroundColor);
  const textColor = useThemeStore((s) => s.textColor);
  const font = useThemeStore((s) => s.font);

  const resetTheme = useThemeStore((s) => s.reset);

  const shop = useShop();

  const cartCount = shop.cartItems.reduce((s, i) => s + i.quantity, 0);

  const heroSlideCount = React.useMemo(
    () =>
      buildHeroCarouselUrls({
        heroImage: "",
        heroGallery,
      }).length,
    [heroGallery],
  );

  const [saveStatus, setSaveStatus] = React.useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");

  const [saveError, setSaveError] = React.useState<string | null>(null);
  const [heroUploadError, setHeroUploadError] = React.useState<string | null>(
    null,
  );
  const [uploadingGalleryHero, setUploadingGalleryHero] =
    React.useState(false);

  const [createOwnerId, setCreateOwnerId] = React.useState("");
  const [createStoreName, setCreateStoreName] = React.useState("");
  const [createSlug, setCreateSlug] = React.useState("");
  const [createBusy, setCreateBusy] = React.useState(false);
  const [createError, setCreateError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!isCreateFlow) return;
    const s = getAuthSession();
    const uid = s?.user?.id;
    if (uid) setCreateOwnerId((cur) => (cur.trim() ? cur : uid));
  }, [isCreateFlow]);

  async function handleCreateStore() {
    setCreateError(null);
    const owner = createOwnerId.trim();
    const name = createStoreName.trim();
    if (!owner) {
      setCreateError("Эзэмшигч (Owner ID) оруулна уу.");
      return;
    }
    if (!name) {
      setCreateError("Дэлгүүрийн нэр оруулна уу.");
      return;
    }

    setCreateBusy(true);
    try {
      let resolvedGallery = heroGallery;
      try {
        const r = await resolveThemeImageUrlsForStorage("", heroGallery);
        resolvedGallery = r.heroGallery;
      } catch (e) {
        setCreateError(
          e instanceof Error ? e.message : "Зургийг Cloudinary руу илгээхэд алдаа.",
        );
        setCreateBusy(false);
        return;
      }

      const themeConfig = buildSiteThemePersisted({
        preset,
        heroTitle,
        shopName: name,
        heroGallery: resolvedGallery,
        radius,
        cardContentPaddingRem,
        productGridGapRem,
        heroImageHeightPx,
        previewProductCardBasisRem,
      });

      const basePart = normalizeMerchantSlugBase(createSlug.trim() || name);
      let slugBase = basePart.length > 0 ? basePart : "shop";
      slugBase = slugBase.slice(0, 48);

      let lastErr: string | null = null;
      let created: PlatformStoreCreated | null = null;
      for (let i = 0; i < 10; i++) {
        const suffix = crypto.randomUUID().replace(/-/g, "").slice(0, 6);
        const slug = `${slugBase}-${suffix}`;
        try {
          created = await postPlatformStore({
            ownerId: owner,
            name,
            slug,
            themeConfig,
          });
          lastErr = null;
          break;
        } catch (e) {
          lastErr = e instanceof Error ? e.message : String(e);
          const dup =
            /409|давхар|already in use|unique/i.test(lastErr) ||
            lastErr.toLowerCase().includes("slug");
          if (!dup) throw e;
        }
      }
      if (!created) {
        setCreateError(lastErr || "Slug давхцаад дахин оролдоно уу.");
        return;
      }

      await reloadShops();
      switchShop(created.id);
      router.push(PATHS.builderUpdate);
    } catch (e) {
      setCreateError(e instanceof Error ? e.message : String(e));
    } finally {
      setCreateBusy(false);
    }
  }

  async function handleSaveTheme() {
    const merchantBase = getMerchantBaseUrl();
    if (!merchantBase) {
      setSaveError("NEXT_PUBLIC_MERCHANT_API_URL тохируулаагүй байна.");
      setSaveStatus("error");
      return;
    }

    if (!activeShop.id || activeShop.id === "__loading__") {
      setSaveError("Идэвхтэй дэлгүүр алга. Admin-аас дэлгүүр сонгоно уу.");
      setSaveStatus("error");
      return;
    }

    const slides = buildHeroCarouselUrls({
      heroImage: "",
      heroGallery,
    }).length;

    if (slides < 3) {
      setSaveError("Hero gallery-д дор хаяж 3 зураг нэмнэ үү.");
      setSaveStatus("error");
      return;
    }

    setSaveError(null);
    setSaveStatus("saving");

    let resolvedGallery = heroGallery;
    try {
      const r = await resolveThemeImageUrlsForStorage("", heroGallery);
      resolvedGallery = r.heroGallery;
    } catch (e) {
      setSaveError(
        e instanceof Error ? e.message : "Зургийг Cloudinary руу илгээхэд алдаа.",
      );
      setSaveStatus("error");
      return;
    }

    const themeConfig = buildSiteThemePersisted({
      preset,
      heroTitle,
      shopName,
      heroGallery: resolvedGallery,
      radius,
      cardContentPaddingRem,
      productGridGapRem,
      heroImageHeightPx,
      previewProductCardBasisRem,
    });

    try {
      const res = await fetch(
        `${merchantBase.replace(/\/$/, "")}/stores/${encodeURIComponent(activeShop.id)}/theme`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ themeConfig }),
        },
      );

      const data = (await res.json().catch(() => null)) as {
        error?: string;
        id?: string;
        slug?: string;
      } | null;

      if (!res.ok) {
        setSaveError(data?.error || `Алдаа (${res.status})`);
        setSaveStatus("error");
        return;
      }

      const slugFromResponse =
        typeof data?.slug === "string" ? data.slug.trim() : "";
      const themeRowId = typeof data?.id === "string" ? data.id : "";
      const slugStillOld =
        themeRowId === activeShop.id &&
        (!slugFromResponse || slugFromResponse === activeShop.slug);
      if (slugStillOld) {
        let base = normalizeMerchantSlugBase(
          shopName.trim() || activeShop.name,
        );
        if (!base.length) base = "shop";
        base = base.slice(0, 48);
        let rotated = false;
        let lastMsg = "Slug шинэчлэхэд алдаа.";
        for (let i = 0; i < 10; i++) {
          const suffix = crypto.randomUUID().replace(/-/g, "").slice(0, 6);
          try {
            await patchAdminStore(activeShop.id, {
              slug: `${base}-${suffix}`,
            });
            rotated = true;
            break;
          } catch (e) {
            lastMsg = e instanceof Error ? e.message : String(e);
            const dup =
              /409|already in use|давхц/i.test(lastMsg) ||
              lastMsg.toLowerCase().includes("slug");
            if (!dup) {
              setSaveError(lastMsg);
              setSaveStatus("error");
              return;
            }
          }
        }
        if (!rotated) {
          setSaveError(lastMsg);
          setSaveStatus("error");
          return;
        }
      }

      const name = shopName.trim() || activeShop.name;
      if (name !== activeShop.name) {
        await patchAdminStore(activeShop.id, { name });
      }

      await refreshDashboard();
      setHeroImage("");
      setHeroGallery(resolvedGallery);
      setSaveStatus("saved");
      window.setTimeout(() => setSaveStatus("idle"), 2500);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Сүлжээний алдаа");
      setSaveStatus("error");
    }
  }

  const sectionLabelClass =
    "mb-3 text-[10px] font-bold uppercase tracking-widest text-neutral-400";

  const fieldLabelClass = "text-sm font-medium text-neutral-500";

  const inputClass =
    "h-11 rounded-2xl border-slate-100 bg-slate-50 text-sm font-semibold text-slate-900 shadow-none placeholder:text-slate-400 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-slate-200";

  // const sliderStyle = React.useMemo(
  //   () => ({ accentColor: brand }) as React.CSSProperties,
  //   [brand],
  // );

  // const headerBg = React.useMemo(
  //   () =>
  //     ({
  //       background: `linear-gradient(145deg, ${accent} 0%, #ffffff 42%, #f8fafc 100%)`,
  //     }) as React.CSSProperties,
  //   [accent],
  // );

  // const sliderClass =
  //   "h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200/90";

  return (
    <SidebarProvider
      defaultOpen
      style={
        {
          "--sidebar-width": "20rem",
        } as React.CSSProperties
      }
      className="h-full w-full "
    >
      <Sidebar
        collapsible="none"
        className="h-full w-72 shrink-0 border-r border-neutral-200 bg-white text-neutral-900"
        data-theme="minimal"
      >
        {/* HEADER */}

        <SidebarHeader className="border-b border-neutral-200 bg-white px-5 py-4">
          <div className="flex flex-col gap-2">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                {isCreateFlow ? "Шинэ дэлгүүр" : "Theme editor"}
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-[11px] font-semibold">
              {isUpdateFlow ? (
                <Link
                  href={PATHS.builderCreate}
                  className="text-neutral-500 underline decoration-neutral-300 underline-offset-2 hover:text-neutral-900"
                >
                  Шинэ дэлгүүр нэмэх
                </Link>
              ) : null}
              {isCreateFlow ? (
                <Link
                  href={PATHS.builderUpdate}
                  className="text-neutral-500 underline decoration-neutral-300 underline-offset-2 hover:text-neutral-900"
                >
                  Одоогийн дэлгүүр засах
                </Link>
              ) : null}
            </div>
          </div>
        </SidebarHeader>

        {/* CONTENT */}

        <SidebarContent className="overflow-y-auto bg-white">
          {/* SITE SETTINGS */}

          <SidebarGroup className="px-5 py-5">
            <SidebarGroupContent className="space-y-4">
              {(
                [
                  {
                    id: "shop-name",
                    label: "Shop name",
                    val: shopName,
                    set: setShopName,
                    ph: "Nomad Goods",
                  },

                  {
                    id: "hero-title",
                    label: "Tagline",
                    val: heroTitle,
                    set: setHeroTitle,
                    ph: "Subtitle under shop name…",
                  },
                ] as const
              ).map(({ id, label, val, set, ph }) => (
                <div key={id} className="space-y-1.5">
                  <label htmlFor={id} className={fieldLabelClass}>
                    {label}
                  </label>

                  <SidebarInput
                    id={id}
                    value={val}
                    placeholder={ph}
                    onChange={(e) => set(e.target.value)}
                    className={inputClass}
                  />
                </div>
              ))}

              {/* HERO GALLERY */}

              <div className="space-y-2">
                <span className={fieldLabelClass}>
                  Hero gallery
                  {uploadingGalleryHero ? (
                    <span className="ml-2 text-xs font-normal text-amber-600">
                      Cloudinary руу илгээж байна…
                    </span>
                  ) : null}
                </span>

                {heroGallery.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {heroGallery.map((url, index) => (
                      <div
                        key={`${index}-${url.slice(0, 48)}`}
                        className="relative size-14 overflow-hidden rounded-xl border border-neutral-200"
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
                          type="button"
                          className="absolute inset-0 flex items-center justify-center bg-black/50 text-[10px] font-bold text-white opacity-0 transition hover:opacity-100"
                          onClick={() => removeHeroGalleryAt(index)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <input
                  accept="image/*"
                  type="file"
                  disabled={uploadingGalleryHero}
                  className="block w-full text-xs text-neutral-400 file:mr-3 file:cursor-pointer file:rounded-lg file:border file:border-neutral-200 file:bg-white file:px-3 file:py-2 file:text-xs file:font-semibold file:text-neutral-700 file:transition file:hover:bg-neutral-50 disabled:opacity-50"
                  onChange={(e) => {
                    void (async () => {
                      const file = e.target.files?.[0];
                      e.target.value = "";
                      if (!file) return;
                      setHeroUploadError(null);
                      setUploadingGalleryHero(true);
                      try {
                        const url = await uploadImageViaMerchantApi(file);
                        addHeroGalleryImage(url);
                      } catch (err) {
                        setHeroUploadError(
                          err instanceof Error
                            ? err.message
                            : "Зураг upload хийгдсэнгүй.",
                        );
                      } finally {
                        setUploadingGalleryHero(false);
                      }
                    })();
                  }}
                />
              </div>

              {heroUploadError ? (
                <p className="text-xs font-semibold text-red-600">
                  {heroUploadError}
                </p>
              ) : null}

              {/* SLIDE COUNTER */}

              <div
                className={cn(
                  "rounded-xl px-3.5 py-3 text-sm",
                  heroSlideCount >= 3
                    ? "border border-green-100 bg-green-50 text-green-800"
                    : "border border-amber-100 bg-amber-50 text-amber-800",
                )}
              >
                <p className="font-bold">Hero slides: {heroSlideCount} / 3</p>

                <p className="mt-0.5 text-xs font-medium opacity-80">
                  {heroSlideCount >= 3
                    ? "Ready — carousel has enough slides."
                    : "Hero gallery-д дор хаяж 3 зураг нэмнэ үү."}
                </p>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator className="bg-neutral-100" />

          {/* STYLE */}

          <SidebarGroup className="px-5 py-5">
            <SidebarGroupLabel className={sectionLabelClass}>
              Style
            </SidebarGroupLabel>

            <SidebarGroupContent className="space-y-2">
              {themes.map(({ id, label, icon: Icon }) => {
                const active = preset === id;

                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setPreset(id)}
                    className={cn(
                      "flex h-11 w-full items-center gap-3 rounded-xl px-4 text-sm font-semibold transition",
                      active
                        ? "bg-neutral-900 text-white"
                        : "border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-7 items-center justify-center rounded-lg",
                        active
                          ? "bg-white/15 text-white"
                          : "bg-neutral-100 text-neutral-500",
                      )}
                    >
                      <Icon className="size-4 shrink-0" aria-hidden />
                    </span>

                    {label}
                  </button>
                );
              })}
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator className="bg-neutral-100" />

          {/* LAYOUT */}

          <SidebarGroup className="px-5 py-5">
            <SidebarGroupLabel className={sectionLabelClass}>
              Layout
            </SidebarGroupLabel>
            {/* <SidebarGroupContent className="space-y-5 pt-1">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <label htmlFor="radius-theme" className={fieldLabelClass}>
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
              </div> */}

            <SidebarGroupContent className="space-y-5">
              {[
                {
                  id: "radius-theme",
                  label: "Булангийн радиус",
                  value: radius,
                  display: `${radius}px`,
                  min: 2,
                  max: 40,
                  step: 1,
                  onChange: (v: number) => setRadius(v),
                },

                {
                  id: "card-pad",
                  label: "Картын доторх зай",
                  value: cardContentPaddingRem,
                  display: `${cardContentPaddingRem.toFixed(2)}rem`,
                  min: 0.5,
                  max: 2,
                  step: 0.0625,
                  onChange: (v: number) => setCardContentPaddingRem(v),
                },

                {
                  id: "grid-gap",
                  label: "Торын зай",
                  value: productGridGapRem,
                  display: `${productGridGapRem.toFixed(2)}rem`,
                  min: 0.375,
                  max: 2.5,
                  step: 0.0625,
                  onChange: (v: number) => setProductGridGapRem(v),
                },

                {
                  id: "hero-h",
                  label: "Hero өндөр (px)",
                  value: heroImageHeightPx,
                  display: `${Math.round(heroImageHeightPx)}px`,
                  min: 40,
                  max: 900,
                  step: 4,
                  onChange: (v: number) => setHeroImageHeightPx(v),
                },
                {
                  id: "preview-card-basis",
                  label: "Бүтээгдэхүүний картын өргөн",
                  value: previewProductCardBasisRem,
                  display: `${previewProductCardBasisRem.toFixed(2)}rem`,
                  min: 9,
                  max: 24,
                  step: 0.25,
                  onChange: (v: number) => setPreviewProductCardBasisRem(v),
                },
              ].map(
                ({ id, label, value, display, min, max, step, onChange }) => (
                  <div key={id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor={id}
                        className="text-sm font-medium text-neutral-600"
                      >
                        {label}
                      </label>

                      <span className="text-xs font-semibold tabular-nums text-neutral-400">
                        {display}
                      </span>
                    </div>

                    <input
                      id={id}
                      type="range"
                      min={min}
                      max={max}
                      step={step}
                      value={value}
                      onChange={(e) =>
                        onChange(Number.parseFloat(e.target.value))
                      }
                      className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-neutral-200 accent-neutral-900"
                    />
                  </div>
                ),
              )}
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator className="bg-neutral-100" />

          {isCreateFlow ? (
            <SidebarGroup className="px-5 py-5">
              <SidebarGroupLabel className={sectionLabelClass}>
                Шинэ дэлгүүр
              </SidebarGroupLabel>

              <SidebarGroupContent className="space-y-4">
                <p className="text-xs leading-relaxed text-neutral-400">
                  Platform API (<span className="font-mono">POST /stores</span>)
                  — эзэмшигчийн ID нь D1 дээрх мерчант хэрэглэгчийн{" "}
                  <span className="font-mono">users.id</span> (UUID) байх ёстой.
                  Slug хоосон бол нэр + суффикс автоматаар үүснэ.
                </p>

                <div className="space-y-1.5">
                  <label htmlFor="create-owner-id" className={fieldLabelClass}>
                    Owner ID (UUID)
                  </label>
                  <SidebarInput
                    id="create-owner-id"
                    value={createOwnerId}
                    onChange={(e) => setCreateOwnerId(e.target.value)}
                    className={cn(inputClass, "font-mono text-xs")}
                    placeholder="550e8400-e29b-41d4-a716-446655440000"
                    autoComplete="off"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="create-store-name" className={fieldLabelClass}>
                    Дэлгүүрийн нэр
                  </label>
                  <SidebarInput
                    id="create-store-name"
                    value={createStoreName}
                    onChange={(e) => setCreateStoreName(e.target.value)}
                    className={inputClass}
                    placeholder="Nomad Goods"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="create-slug" className={fieldLabelClass}>
                    Slug (сонголттой)
                  </label>
                  <SidebarInput
                    id="create-slug"
                    value={createSlug}
                    onChange={(e) => setCreateSlug(e.target.value)}
                    className={cn(inputClass, "font-mono text-xs")}
                    placeholder="tech-store — хоосон бол random суффикстой"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => void handleCreateStore()}
                  disabled={createBusy}
                  className="h-11 w-full rounded-xl bg-neutral-900 text-sm font-bold text-white transition hover:bg-neutral-800 disabled:opacity-40"
                >
                  {createBusy ? "Үүсгэж байна…" : "Дэлгүүр үүсгэх"}
                </button>

                {createError ? (
                  <p className="text-xs font-semibold text-red-600">{createError}</p>
                ) : null}
              </SidebarGroupContent>
            </SidebarGroup>
          ) : (
            <SidebarGroup className="px-5 py-5">
              <SidebarGroupLabel className={sectionLabelClass}>
                Хадгалах
              </SidebarGroupLabel>

              <SidebarGroupContent className="space-y-4">
                <p className="text-xs leading-relaxed text-neutral-400">
                  Идэвхтэй дэлгүүрийн ({activeShop.name}) theme-ийг серверт
                  хадгална. Hero gallery дор хаяж 3 зураг шаардлагатай.
                </p>

                <button
                  type="button"
                  onClick={() => void handleSaveTheme()}
                  disabled={saveStatus === "saving"}
                  className="h-11 w-full rounded-xl bg-neutral-900 text-sm font-bold text-white transition hover:bg-neutral-800 disabled:opacity-40"
                >
                  {saveStatus === "saving"
                    ? "Хадгалж байна…"
                    : saveStatus === "saved"
                      ? "Хадгалагдлаа"
                      : "Хадгалах"}
                </button>

                {saveError ? (
                  <p className="text-xs font-semibold text-red-600">{saveError}</p>
                ) : null}
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </SidebarContent>

        {/* FOOTER */}

        <SidebarFooter className="border-t border-neutral-200 bg-white px-5 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => resetTheme()}
            className="h-10 w-full rounded-xl border-neutral-200 text-sm font-semibold text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
          >
            Reset to default
          </Button>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
}
