"use client";

import * as React from "react";

export type ThemeId = "minimal" | "glass" | "neumorph";

export type StoreState = {
  currentTheme: ThemeId;
  heroTitle: string;
  heroImage: string;
  /** true бол `data-theme`-ийн `--pv-radius` ашиглана (inline override байхгүй) */
  cardRadiusFollowsTheme: boolean;
  /** `cardRadiusFollowsTheme` false үед (px) — бүх `var(--pv-radius)` элементүүдэд */
  cardRadiusPx: number;
  /** Карт / панелийн доторх padding (rem) */
  cardContentPaddingRem: number;
  /** Барааны торын хоорондын зай (rem) */
  productGridGapRem: number;
  setCurrentTheme: (theme: ThemeId) => void;
  setHeroTitle: (value: string) => void;
  setHeroImage: (value: string) => void;
  setCardRadiusFollowsTheme: (value: boolean) => void;
  setCardRadiusPx: (value: number) => void;
  setCardContentPaddingRem: (value: number) => void;
  setProductGridGapRem: (value: number) => void;
};

const StoreContext = React.createContext<StoreState | null>(null);

const defaultHeroTitle = "Build your store in minutes.";
const defaultHeroImage = "/background1.png";

const defaultCardRadiusPx = 16;
const defaultCardContentPaddingRem = 1;
const defaultProductGridGapRem = 1;

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = React.useState<ThemeId>("minimal");
  const [heroTitle, setHeroTitle] = React.useState(defaultHeroTitle);
  const [heroImage, setHeroImage] = React.useState(defaultHeroImage);
  const [cardRadiusFollowsTheme, setCardRadiusFollowsTheme] =
    React.useState(true);
  const [cardRadiusPx, setCardRadiusPx] = React.useState(defaultCardRadiusPx);
  const [cardContentPaddingRem, setCardContentPaddingRem] = React.useState(
    defaultCardContentPaddingRem,
  );
  const [productGridGapRem, setProductGridGapRem] = React.useState(
    defaultProductGridGapRem,
  );

  const value = React.useMemo<StoreState>(
    () => ({
      currentTheme,
      heroTitle,
      heroImage,
      cardRadiusFollowsTheme,
      cardRadiusPx,
      cardContentPaddingRem,
      productGridGapRem,
      setCurrentTheme,
      setHeroTitle,
      setHeroImage,
      setCardRadiusFollowsTheme,
      setCardRadiusPx,
      setCardContentPaddingRem,
      setProductGridGapRem,
    }),
    [
      currentTheme,
      heroTitle,
      heroImage,
      cardRadiusFollowsTheme,
      cardRadiusPx,
      cardContentPaddingRem,
      productGridGapRem,
    ],
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore(): StoreState {
  const ctx = React.useContext(StoreContext);
  if (!ctx) {
    throw new Error("useStore must be used within StoreProvider");
  }
  return ctx;
}
