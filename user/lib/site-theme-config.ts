export type ThemePresetId = "minimal" | "glass" | "neumorph";

/** D1 `theme_config` / API-д зөвхөн эдгээр талбарууд хадгалагдана. */
export type SiteThemePersisted = {
  builderTheme: ThemePresetId;
  heroTitle: string;
  shopName: string;
  layout: {
    radiusPx: number;
    cardContentPaddingRem: number;
    productGridGapRem: number;
    heroImageHeightPx: number;
  };
  heroGallery: string[];
};

const PRESETS: ThemePresetId[] = ["minimal", "glass", "neumorph"];

function isPreset(v: unknown): v is ThemePresetId {
  return typeof v === "string" && (PRESETS as string[]).includes(v);
}

function num(v: unknown, fallback: number, min: number, max: number): number {
  const n = typeof v === "number" && Number.isFinite(v) ? v : fallback;
  return Math.min(max, Math.max(min, n));
}

/** Сервер / localStorage-аас уншсан JSON → store patch. */
export type ParsedSiteTheme = {
  preset?: ThemePresetId;
  heroTitle?: string;
  shopName?: string;
  heroGallery?: string[];
  radius?: number;
  cardContentPaddingRem?: number;
  productGridGapRem?: number;
  heroImageHeightPx?: number;
};

export function parseSiteThemePersisted(raw: unknown): ParsedSiteTheme {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};

  const o = raw as Record<string, unknown>;
  const patch: ParsedSiteTheme = {};

  if (isPreset(o.builderTheme)) patch.preset = o.builderTheme;
  else if (isPreset(o.preset)) patch.preset = o.preset;

  if (typeof o.heroTitle === "string") patch.heroTitle = o.heroTitle;
  if (typeof o.shopName === "string") patch.shopName = o.shopName;

  if (Array.isArray(o.heroGallery)) {
    patch.heroGallery = o.heroGallery.filter(
      (u): u is string => typeof u === "string" && u.trim().length > 0,
    );
  }

  const layout =
    o.layout && typeof o.layout === "object" && !Array.isArray(o.layout)
      ? (o.layout as Record<string, unknown>)
      : null;

  if (layout) {
    patch.radius = num(layout.radiusPx, 12, 2, 48);
    patch.cardContentPaddingRem = num(layout.cardContentPaddingRem, 1, 0.5, 2);
    patch.productGridGapRem = num(layout.productGridGapRem, 1, 0.375, 2.5);
    patch.heroImageHeightPx = num(layout.heroImageHeightPx, 240, 40, 900);
  } else {
    if (typeof o.radius === "number") patch.radius = num(o.radius, 12, 2, 48);
    if (typeof o.cardContentPaddingRem === "number") {
      patch.cardContentPaddingRem = num(
        o.cardContentPaddingRem,
        1,
        0.5,
        2,
      );
    }
    if (typeof o.productGridGapRem === "number") {
      patch.productGridGapRem = num(o.productGridGapRem, 1, 0.375, 2.5);
    }
    if (typeof o.heroImageHeightPx === "number") {
      patch.heroImageHeightPx = num(o.heroImageHeightPx, 240, 40, 900);
    }
  }

  return patch;
}

/** Theme studio state → API / D1 JSON (зөвхөн whitelist). */
export function buildSiteThemePersisted(s: {
  preset: ThemePresetId;
  heroTitle: string;
  shopName: string;
  heroGallery: string[];
  radius: number;
  cardContentPaddingRem: number;
  productGridGapRem: number;
  heroImageHeightPx: number;
}): SiteThemePersisted {
  return {
    builderTheme: s.preset,
    heroTitle: s.heroTitle,
    shopName: s.shopName,
    layout: {
      radiusPx: Math.round(s.radius),
      cardContentPaddingRem: s.cardContentPaddingRem,
      productGridGapRem: s.productGridGapRem,
      heroImageHeightPx: Math.round(s.heroImageHeightPx),
    },
    heroGallery: [...s.heroGallery],
  };
}
