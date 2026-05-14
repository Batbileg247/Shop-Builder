import type {
  CatalogFilterDefinition,
  CatalogMultiselectFilter,
  CatalogPriceRangeFilter,
  Product,
  ProductDraft,
  ShopTheme,
} from "@/types";
import { slugify } from "@/lib/utils";

export const defaultTheme: ShopTheme = {
  name: "Nomad Goods",
  tagline: "Everyday pieces with a Mongolian point of view.",
  announcement: "Free delivery in Ulaanbaatar this week",
  primaryColor: "#047857",
  accentColor: "#f97316",
  backgroundColor: "#f8fafc",
  textColor: "#18181b",
  heroImage: "",
  heroGallery: [],
  layout: "grid",
  radius: 6,
  currency: "₮",
  font: "sans",
};

export const defaultProducts: Product[] = [];

const defaultPriceRangeFilter: CatalogPriceRangeFilter = {
  id: "shop-price",
  type: "priceRange",
  label: "Price range",
  min: 0,
  max: 250_000,
};

/**
 * Category multiselect options come only from owner-defined `categories`
 * (plus synthetic "On sale"). Used by the builder storefront filters.
 */
export function buildCatalogFilterDefinitions(
  categories: string[],
): CatalogFilterDefinition[] {
  const sorted = [...new Set(categories.map((c) => c.trim()).filter(Boolean))].sort(
    (a, b) => a.localeCompare(b),
  );
  const categoryOptions = sorted.map((label, i) => ({
    id: `cat-${slugify(label) || "x"}-${i}`,
    label,
    matchValue: label,
  }));
  const multiselect: CatalogMultiselectFilter = {
    id: "shop-category",
    type: "multiselect",
    label: "Category",
    options: [
      ...categoryOptions,
      { id: "cat-sale", label: "On sale", matchValue: "__sale__" },
    ],
  };
  return [multiselect, defaultPriceRangeFilter];
}

export const emptyDraft: ProductDraft = {
  name: "",
  category: "",
  description: "",
  price: 99000,
  salePrice: "",
  inventory: 10,
  image: "",
  size: "",
  featured: "yes",
};
