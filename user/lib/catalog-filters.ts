import type { CatalogFilterDefinition, Product } from "@/types";

/** Sort by effective price (sale or list) after filters are applied. */
export type PriceSortMode = "none" | "asc" | "desc";

/** Selected option ids per multiselect filter, and current range per price filter. */
export type CatalogFilterSelections = {
  multiselect: Record<string, string[]>;
  priceRange: Record<string, { min: number; max: number }>;
};

export function buildDefaultSelections(
  definitions: CatalogFilterDefinition[],
): CatalogFilterSelections {
  const multiselect: Record<string, string[]> = {};
  const priceRange: Record<string, { min: number; max: number }> = {};
  for (const def of definitions) {
    if (def.type === "multiselect") multiselect[def.id] = [];
    else priceRange[def.id] = { min: def.min, max: def.max };
  }
  return { multiselect, priceRange };
}

function matchesMultiselectOption(product: Product, matchValue: string) {
  if (matchValue === "__sale__") return product.salePrice != null;
  return product.category === matchValue;
}

export function applyCatalogFilters(
  products: Product[],
  definitions: CatalogFilterDefinition[],
  selections: CatalogFilterSelections,
): Product[] {
  return products.filter((product) => {
    for (const def of definitions) {
      if (def.type === "multiselect") {
        const selectedIds = selections.multiselect[def.id] ?? [];
        if (selectedIds.length === 0) continue;
        const opts = def.options.filter((o) => selectedIds.includes(o.id));
        const any = opts.some((o) =>
          matchesMultiselectOption(product, o.matchValue),
        );
        if (!any) return false;
      } else {
        const range = selections.priceRange[def.id] ?? {
          min: def.min,
          max: def.max,
        };
        const eff = product.salePrice ?? product.price;
        if (eff < range.min || eff > range.max) return false;
      }
    }
    return true;
  });
}

export function filterDefinitionsSignature(
  definitions: CatalogFilterDefinition[],
): string {
  return JSON.stringify(definitions);
}
