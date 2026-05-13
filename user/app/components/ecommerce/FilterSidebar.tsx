"use client";

import type { CatalogFilterDefinition } from "@/types";
import type {
  CatalogFilterSelections,
  PriceSortMode,
} from "@/lib/catalog-filters";
import { FilterItem } from "@/app/components/ecommerce/FilterItem";

export function FilterSidebar({
  definitions,
  selections,
  onSelectionsChange,
  priceSortMode = "none",
  onPriceSortCycle,
}: {
  definitions: CatalogFilterDefinition[];
  selections: CatalogFilterSelections;
  onSelectionsChange: (next: CatalogFilterSelections) => void;
  /** Shown on the first price-range filter; cycles none → low→high → high→low. */
  priceSortMode?: PriceSortMode;
  onPriceSortCycle?: () => void;
}) {
  function toggleMultiselect(filterId: string, optionId: string, on: boolean) {
    const cur = selections.multiselect[filterId] ?? [];
    const nextIds = on
      ? cur.includes(optionId)
        ? cur
        : [...cur, optionId]
      : cur.filter((id) => id !== optionId);
    onSelectionsChange({
      ...selections,
      multiselect: { ...selections.multiselect, [filterId]: nextIds },
    });
  }

  function setPriceRange(
    filterId: string,
    key: "min" | "max",
    value: number,
    defMin: number,
    defMax: number,
  ) {
    const cur = selections.priceRange[filterId] ?? { min: defMin, max: defMax };
    const next = { ...cur, [key]: value };
    if (next.min > next.max) {
      if (key === "min") next.max = next.min;
      else next.min = next.max;
    }
    next.min = Math.max(defMin, Math.min(defMax, next.min));
    next.max = Math.max(defMin, Math.min(defMax, next.max));
    onSelectionsChange({
      ...selections,
      priceRange: { ...selections.priceRange, [filterId]: next },
    });
  }

  if (definitions.length === 0) {
    return (
      <p className="p-4 text-sm text-pv-muted">No filters configured yet.</p>
    );
  }

  const firstPriceFilterId = definitions.find(
    (d) => d.type === "priceRange",
  )?.id;

  const priceSortLabel =
    priceSortMode === "asc"
      ? "Lowest → highest (tap for reverse)"
      : priceSortMode === "desc"
        ? "Highest → lowest (tap to clear sort)"
        : "Tap to sort: lowest → highest";

  return (
    <div className="flex flex-col gap-0 p-3 sm:p-4">
      <p className="px-1 pb-3 text-xs font-semibold uppercase tracking-wider text-pv-muted">
        Filters
      </p>
      {definitions.map((def) =>
        def.type === "multiselect" ? (
          <details
            className="group border-b border-pv-divider py-1 last:border-b-0"
            key={def.id}
            open
          >
            <summary className="cursor-pointer list-none py-2 text-sm font-semibold text-pv-fg marker:hidden [&::-webkit-details-marker]:hidden">
              <span className="flex items-center justify-between gap-2">
                {def.label}
                <span className="text-pv-muted group-open:rotate-180">▾</span>
              </span>
            </summary>
            <div className="flex flex-col gap-0.5 pb-3 pl-1">
              {def.options.map((opt) => (
                <FilterItem
                  checked={(selections.multiselect[def.id] ?? []).includes(
                    opt.id,
                  )}
                  id={`${def.id}-${opt.id}`}
                  key={opt.id}
                  label={opt.label}
                  onChange={(on) => toggleMultiselect(def.id, opt.id, on)}
                />
              ))}
            </div>
          </details>
        ) : (
          <details
            className="group border-b border-pv-divider py-1 last:border-b-0"
            key={def.id}
            open
          >
            <summary className="cursor-pointer list-none py-2 text-sm font-semibold text-pv-fg marker:hidden [&::-webkit-details-marker]:hidden">
              <span className="flex items-center justify-between gap-2">
                {def.label}
                <span className="text-pv-muted group-open:rotate-180">▾</span>
              </span>
            </summary>
            <div className="space-y-3 pb-3">
              {onPriceSortCycle && def.id === firstPriceFilterId && (
                <button
                  className="w-full rounded-(--pv-radius) border border-pv-border bg-pv-card px-3 py-2.5 text-left text-xs font-medium text-pv-fg transition hover:bg-pv-empty"
                  onClick={() => onPriceSortCycle()}
                  type="button"
                >
                  {priceSortLabel}
                </button>
              )}
              <div className="grid grid-cols-2 gap-2">
                <label className="text-xs text-pv-muted">
                  Min
                  <input
                    className="pv-input mt-1 pl-2 w-full"
                    max={def.max}
                    min={def.min}
                    onChange={(e) =>
                      setPriceRange(
                        def.id,
                        "min",
                        Number(e.target.value) || def.min,
                        def.min,
                        def.max,
                      )
                    }
                    type="number"
                    value={selections.priceRange[def.id]?.min ?? def.min}
                  />
                </label>
                <label className="text-xs text-pv-muted">
                  Max
                  <input
                    className="pv-input mt-1 pl-2 w-full"
                    max={def.max}
                    min={def.min}
                    onChange={(e) =>
                      setPriceRange(
                        def.id,
                        "max",
                        Number(e.target.value) || def.max,
                        def.min,
                        def.max,
                      )
                    }
                    type="number"
                    value={selections.priceRange[def.id]?.max ?? def.max}
                  />
                </label>
              </div>
              <input
                className="w-full accent-pv-primary"
                max={def.max}
                min={def.min}
                onChange={(e) =>
                  setPriceRange(
                    def.id,
                    "max",
                    Number(e.target.value),
                    def.min,
                    def.max,
                  )
                }
                type="range"
                value={selections.priceRange[def.id]?.max ?? def.max}
              />
            </div>
          </details>
        ),
      )}
    </div>
  );
}
