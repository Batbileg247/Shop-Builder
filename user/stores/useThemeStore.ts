"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemePresetId = "minimal" | "glass" | "neumorph";

export type ThemeState = {
  /** Theme Studio preset (maps to `.site-preview-root[data-theme]`). */
  preset: ThemePresetId;

  /** Storefront hero text + image. */
  heroTitle: string;
  heroImage: string;

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
  heroTitle: "Build your store in minutes.",
  heroImage: "/background1.png",
  primaryColor: "#0a0a0a",
  backgroundColor: "#ffffff",
  textColor: "#0a0a0a",
  font: "sans",
  radius: 8,
  cardContentPaddingRem: 1,
  productGridGapRem: 1,
};

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
      name: "shop-builder-theme-v1",
      version: 1,
      partialize: (s) => ({
        preset: s.preset,
        heroTitle: s.heroTitle,
        heroImage: s.heroImage,
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

