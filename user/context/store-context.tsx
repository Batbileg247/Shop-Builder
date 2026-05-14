"use client";

import * as React from "react";

import { PATHS } from "@/lib/site-paths";

export type ThemeId = "minimal" | "glass" | "neumorph";

export type StoreState = {
  currentTheme: ThemeId;
  heroTitle: string;
  heroImage: string;
  /** Дэлгүүрийн route base path (theme studio дээр preview base, public дээр `/s/:slug`) */
  basePath: string;
  /** true бол `data-theme`-ийн `--pv-radius` ашиглана (inline override байхгүй) */
  cardRadiusFollowsTheme: boolean;
  /** `cardRadiusFollowsTheme` false үед (px) — бүх `var(--pv-radius)` элементүүдэд */
  cardRadiusPx: number;
  /** Карт / панелийн доторх padding (rem) */
  cardContentPaddingRem: number;
  /** Барааны торын хоорондын зай (rem) */
  productGridGapRem: number;
  /** Дэлгүүр үүсгэхэд ашиглах merchant user id (Platform API ownerId) */
  ownerId: string;
  /** Дэлгүүрийн нэр */
  storeName: string;
  /** Дэлгүүрийн slug (publish хийгдсэний дараа storefront fetch хийхэд ашиглана) */
  storeSlug: string;
  /** Publish процессын төлөв */
  publishStatus: "idle" | "creating" | "created" | "error";
  publishError: string | null;
  setCurrentTheme: (theme: ThemeId) => void;
  setHeroTitle: (value: string) => void;
  setHeroImage: (value: string) => void;
  setBasePath: (value: string) => void;
  setCardRadiusFollowsTheme: (value: boolean) => void;
  setCardRadiusPx: (value: number) => void;
  setCardContentPaddingRem: (value: number) => void;
  setProductGridGapRem: (value: number) => void;
  setOwnerId: (value: string) => void;
  setStoreName: (value: string) => void;
  setStoreSlug: (value: string) => void;
  setPublishStatus: (value: StoreState["publishStatus"]) => void;
  setPublishError: (value: string | null) => void;
};

const StoreContext = React.createContext<StoreState | null>(null);

const defaultHeroTitle = "Build your store in minutes.";
const defaultHeroImage = "/background1.png";

const defaultCardRadiusPx = 16;
const defaultCardContentPaddingRem = 1;
const defaultProductGridGapRem = 1;
const defaultStoreName = "My Store";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = React.useState<ThemeId>("minimal");
  const [heroTitle, setHeroTitle] = React.useState(defaultHeroTitle);
  const [heroImage, setHeroImage] = React.useState(defaultHeroImage);
  const [basePath, setBasePath] = React.useState<string>(PATHS.builderUpdate);
  const [cardRadiusFollowsTheme, setCardRadiusFollowsTheme] =
    React.useState(true);
  const [cardRadiusPx, setCardRadiusPx] = React.useState(defaultCardRadiusPx);
  const [cardContentPaddingRem, setCardContentPaddingRem] = React.useState(
    defaultCardContentPaddingRem,
  );
  const [productGridGapRem, setProductGridGapRem] = React.useState(
    defaultProductGridGapRem,
  );
  const [ownerId, setOwnerId] = React.useState("");
  const [storeName, setStoreName] = React.useState(defaultStoreName);
  const [storeSlug, setStoreSlug] = React.useState("");
  const [publishStatus, setPublishStatus] =
    React.useState<StoreState["publishStatus"]>("idle");
  const [publishError, setPublishError] = React.useState<string | null>(null);

  const value = React.useMemo<StoreState>(
    () => ({
      currentTheme,
      heroTitle,
      heroImage,
      basePath,
      cardRadiusFollowsTheme,
      cardRadiusPx,
      cardContentPaddingRem,
      productGridGapRem,
      ownerId,
      storeName,
      storeSlug,
      publishStatus,
      publishError,
      setCurrentTheme,
      setHeroTitle,
      setHeroImage,
      setBasePath,
      setCardRadiusFollowsTheme,
      setCardRadiusPx,
      setCardContentPaddingRem,
      setProductGridGapRem,
      setOwnerId,
      setStoreName,
      setStoreSlug,
      setPublishStatus,
      setPublishError,
    }),
    [
      currentTheme,
      heroTitle,
      heroImage,
      basePath,
      cardRadiusFollowsTheme,
      cardRadiusPx,
      cardContentPaddingRem,
      productGridGapRem,
      ownerId,
      storeName,
      storeSlug,
      publishStatus,
      publishError,
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
