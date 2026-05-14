"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type ThemePresetId = "minimal" | "glass" | "neumorph";

export type ThemeState = {
  /** Theme Studio preset (maps to `.site-preview-root[data-theme]`). */
  preset: ThemePresetId;

  /** Tagline under the shop name on `ShopHero`. */
  heroTitle: string;
  /** Primary hero slide (URL, path, or data URL). */
  heroImage: string;
  /** Extra carousel slides (owner-provided). */
  heroGallery: string[];
  /** Shown as large title on `ShopHero` (e.g. Nomad Goods). */
  shopName: string;
  /** Banner above the title on `ShopHero`. */
  heroAnnouncement: string;

  /** Core colors used by the real storefront theme. */
  primaryColor: string;
  backgroundColor: string;
  textColor: string;

  /** Typography + shape. */
  font: "sans" | "serif" | "mono";
  radius: number;

  /** Theme Studio spacing tokens. */
  cardContentPaddingRem: number;
  productGridGapRem: number;
};

export type ThemeActions = {
  setPreset: (preset: ThemePresetId) => void;
  setHeroTitle: (value: string) => void;
  setHeroImage: (value: string) => void;
  setHeroGallery: (urls: string[]) => void;
  addHeroGalleryImage: (url: string) => void;
  removeHeroGalleryAt: (index: number) => void;
  setShopName: (value: string) => void;
  setHeroAnnouncement: (value: string) => void;
  setPrimaryColor: (value: string) => void;
  setBackgroundColor: (value: string) => void;
  setTextColor: (value: string) => void;
  setFont: (value: ThemeState["font"]) => void;
  setRadius: (value: number) => void;
  setCardContentPaddingRem: (value: number) => void;
  setProductGridGapRem: (value: number) => void;
  reset: () => void;
};

function presetDefaults(preset: ThemePresetId): Partial<ThemeState> {
  if (preset === "glass") {
    return {
      primaryColor: "#38bdf8",
      backgroundColor: "#0b1220",
      textColor: "#f8fafc",
      font: "sans",
      radius: 16,
    };
  }
  if (preset === "neumorph") {
    return {
      primaryColor: "#111827",
      backgroundColor: "#eef2ff",
      textColor: "#0f172a",
      font: "sans",
      radius: 24,
    };
  }
  return {
    primaryColor: "#0a0a0a",
    backgroundColor: "#ffffff",
    textColor: "#0a0a0a",
    font: "sans",
    radius: 8,
  };
}

const defaults: ThemeState = {
  preset: "minimal",
  heroTitle: "Everyday pieces with a Mongolian point of view.",
  heroImage: "",
  heroGallery: [],
  shopName: "Nomad Goods",
  heroAnnouncement: "",
  primaryColor: "#0a0a0a",
  backgroundColor: "#ffffff",
  textColor: "#0a0a0a",
  font: "sans",
  radius: 8,
  cardContentPaddingRem: 1,
  productGridGapRem: 1,
};

const THEME_STORE_VERSION = 2;

/** Legacy single-key blob; migrated once into the first per-shop key read. */
const LEGACY_THEME_STORAGE_KEY = "shop-builder-theme-v1";

/**
 * Per-shop theme slices in localStorage (`…__shop__${id}`). Set by
 * `ThemeStoreShopPersistenceSync` before `persist.rehydrate()` on shop switch.
 * Do not revert to a single global persist key without updating that sync.
 */
export const themePersistenceShopIdRef = { current: "" as string };

function perShopThemeStorageKey(shopId: string) {
  return `${LEGACY_THEME_STORAGE_KEY}__shop__${shopId}`;
}

const perShopThemeStorage = createJSONStorage(() => ({
  getItem: (_name: string): string | null => {
    const id = themePersistenceShopIdRef.current;
    if (!id) return null;
    const key = perShopThemeStorageKey(id);
    let raw = localStorage.getItem(key);
    if (raw === null) {
      const legacy = localStorage.getItem(LEGACY_THEME_STORAGE_KEY);
      if (legacy !== null) {
        localStorage.setItem(key, legacy);
        localStorage.removeItem(LEGACY_THEME_STORAGE_KEY);
        raw = legacy;
      }
    }
    return raw;
  },
  setItem: (_name: string, value: string) => {
    const id = themePersistenceShopIdRef.current;
    if (!id) return;
    localStorage.setItem(perShopThemeStorageKey(id), value);
  },
  removeItem: (_name: string) => {
    const id = themePersistenceShopIdRef.current;
    if (!id) return;
    localStorage.removeItem(perShopThemeStorageKey(id));
  },
}));

function themePatchFromPersisted(value: unknown): Partial<ThemeState> {
  if (!value || typeof value !== "object") return {};

  const source = value as Record<string, unknown>;
  const patch: Partial<ThemeState> = {};

  if (
    source.preset === "minimal" ||
    source.preset === "glass" ||
    source.preset === "neumorph"
  ) {
    patch.preset = source.preset;
  }

  if (typeof source.heroTitle === "string") patch.heroTitle = source.heroTitle;
  if (typeof source.heroImage === "string") patch.heroImage = source.heroImage;
  if (Array.isArray(source.heroGallery)) {
    patch.heroGallery = source.heroGallery.filter(
      (u): u is string => typeof u === "string",
    );
  }
  if (typeof source.shopName === "string") patch.shopName = source.shopName;
  if (typeof source.heroAnnouncement === "string") {
    patch.heroAnnouncement = source.heroAnnouncement;
  }
  if (typeof source.primaryColor === "string") {
    patch.primaryColor = source.primaryColor;
  }
  if (typeof source.backgroundColor === "string") {
    patch.backgroundColor = source.backgroundColor;
  }
  if (typeof source.textColor === "string") patch.textColor = source.textColor;
  if (
    source.font === "sans" ||
    source.font === "serif" ||
    source.font === "mono"
  ) {
    patch.font = source.font;
  }
  if (typeof source.radius === "number") patch.radius = source.radius;
  if (typeof source.cardContentPaddingRem === "number") {
    patch.cardContentPaddingRem = source.cardContentPaddingRem;
  }
  if (typeof source.productGridGapRem === "number") {
    patch.productGridGapRem = source.productGridGapRem;
  }

  return patch;
}

export const useThemeStore = create<ThemeState & ThemeActions>()(
  persist(
    (set) => ({
      ...defaults,
      setPreset: (preset) =>
        set((prev) => ({
          ...prev,
          preset,
          ...presetDefaults(preset),
        })),
      setHeroTitle: (heroTitle) => set({ heroTitle }),
      setHeroImage: (heroImage) => set({ heroImage }),
      setHeroGallery: (heroGallery) => set({ heroGallery }),
      addHeroGalleryImage: (url) =>
        set((s) => ({
          heroGallery: url.trim()
            ? [...s.heroGallery, url.trim()]
            : s.heroGallery,
        })),
      removeHeroGalleryAt: (index) =>
        set((s) => ({
          heroGallery: s.heroGallery.filter((_, i) => i !== index),
        })),
      setShopName: (shopName) => set({ shopName }),
      setHeroAnnouncement: (heroAnnouncement) => set({ heroAnnouncement }),
      setPrimaryColor: (primaryColor) => set({ primaryColor }),
      setBackgroundColor: (backgroundColor) => set({ backgroundColor }),
      setTextColor: (textColor) => set({ textColor }),
      setFont: (font) => set({ font }),
      setRadius: (radius) => set({ radius }),
      setCardContentPaddingRem: (cardContentPaddingRem) =>
        set({ cardContentPaddingRem }),
      setProductGridGapRem: (productGridGapRem) => set({ productGridGapRem }),
      reset: () => set({ ...defaults }),
    }),
    {
      name: LEGACY_THEME_STORAGE_KEY,
      storage: perShopThemeStorage,
      version: THEME_STORE_VERSION,
      migrate: (persisted) => ({
        ...defaults,
        ...themePatchFromPersisted(persisted),
      }),
      merge: (persisted, current) => ({
        ...current,
        ...themePatchFromPersisted(persisted),
      }),
      partialize: (s) => ({
        preset: s.preset,
        heroTitle: s.heroTitle,
        heroImage: s.heroImage,
        heroGallery: s.heroGallery,
        shopName: s.shopName,
        heroAnnouncement: s.heroAnnouncement,
        primaryColor: s.primaryColor,
        backgroundColor: s.backgroundColor,
        textColor: s.textColor,
        font: s.font,
        radius: s.radius,
        cardContentPaddingRem: s.cardContentPaddingRem,
        productGridGapRem: s.productGridGapRem,
      }),
    },
  ),
);
