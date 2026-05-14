export type ThemePresetId = "minimal" | "glass" | "neumorph";

export type ThemeStudioFont = "sans" | "serif" | "mono";

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
    previewProductCardBasisRem: number;
  };
  heroGallery: string[];
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  font: ThemeStudioFont;
  heroAnnouncement: string;
};

const PRESETS: ThemePresetId[] = ["minimal", "glass", "neumorph"];

function isPreset(v: unknown): v is ThemePresetId {
  return typeof v === "string" && (PRESETS as string[]).includes(v);
}

function num(v: unknown, fallback: number, min: number, max: number): number {
  const n = typeof v === "number" && Number.isFinite(v) ? v : fallback;
  return Math.min(max, Math.max(min, n));
}

function safeThemeColor(v: unknown): string | undefined {
  if (typeof v !== "string") return undefined;
  const s = v.trim().slice(0, 40);
  if (!s) return undefined;
  if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(s)) return s;
  if (/^rgba?\(/i.test(s)) return s;
  return undefined;
}

function parseThemeFont(v: unknown): ThemeStudioFont | undefined {
  if (v === "sans" || v === "serif" || v === "mono") return v;
  return undefined;
}

function safeHeroAnnouncement(v: unknown): string | undefined {
  if (typeof v !== "string") return undefined;
  const t = v.trim();
  if (!t) return undefined;
  return t.slice(0, 500);
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
  previewProductCardBasisRem?: number;
  primaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  font?: ThemeStudioFont;
  heroAnnouncement?: string;
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
    patch.previewProductCardBasisRem = num(
      layout.previewProductCardBasisRem,
      14,
      9,
      24,
    );
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
    if (typeof o.previewProductCardBasisRem === "number") {
      patch.previewProductCardBasisRem = num(
        o.previewProductCardBasisRem,
        14,
        9,
        24,
      );
    }
  }

  const pc = safeThemeColor(o.primaryColor);
  if (pc) patch.primaryColor = pc;
  const bc = safeThemeColor(o.backgroundColor);
  if (bc) patch.backgroundColor = bc;
  const tc = safeThemeColor(o.textColor);
  if (tc) patch.textColor = tc;
  const f = parseThemeFont(o.font);
  if (f) patch.font = f;
  const ann = safeHeroAnnouncement(o.heroAnnouncement);
  if (ann) patch.heroAnnouncement = ann;

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
  previewProductCardBasisRem: number;
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  font: ThemeStudioFont;
  heroAnnouncement: string;
}): SiteThemePersisted {
  const pc = safeThemeColor(s.primaryColor) ?? "#0a0a0a";
  const bc = safeThemeColor(s.backgroundColor) ?? "#ffffff";
  const tc = safeThemeColor(s.textColor) ?? "#0a0a0a";
  const font = parseThemeFont(s.font) ?? "sans";
  return {
    builderTheme: s.preset,
    heroTitle: s.heroTitle,
    shopName: s.shopName,
    layout: {
      radiusPx: Math.round(s.radius),
      cardContentPaddingRem: s.cardContentPaddingRem,
      productGridGapRem: s.productGridGapRem,
      heroImageHeightPx: Math.round(s.heroImageHeightPx),
      previewProductCardBasisRem: num(
        s.previewProductCardBasisRem,
        14,
        9,
        24,
      ),
    },
    heroGallery: [...s.heroGallery],
    primaryColor: pc,
    backgroundColor: bc,
    textColor: tc,
    font,
    heroAnnouncement: safeHeroAnnouncement(s.heroAnnouncement) ?? "",
  };
}
