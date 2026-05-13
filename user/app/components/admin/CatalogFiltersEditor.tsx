"use client";

import { useCallback } from "react";
import type { CatalogFilterDefinition } from "@/types";
import { Field } from "@/ui";
import { Button } from "@/ui/button";

function newId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function CatalogFiltersEditor({
  filters,
  onChange,
}: {
  filters: CatalogFilterDefinition[];
  onChange: (next: CatalogFilterDefinition[]) => void;
}) {
  const addMultiselect = useCallback(() => {
    onChange([
      ...filters,
      {
        id: newId("mf"),
        type: "multiselect",
        label: "New filter",
        options: [
          {
            id: newId("opt"),
            label: "Option",
            matchValue: "General",
          },
        ],
      },
    ]);
  }, [filters, onChange]);

  const addPriceRange = useCallback(() => {
    onChange([
      ...filters,
      {
        id: newId("pf"),
        type: "priceRange",
        label: "Price range",
        min: 0,
        max: 500_000,
      },
    ]);
  }, [filters, onChange]);

  const updateFilter = useCallback(
    (index: number, patch: Partial<CatalogFilterDefinition>) => {
      const next = [...filters];
      const cur = next[index];
      if (!cur) return;
      next[index] = { ...cur, ...patch } as CatalogFilterDefinition;
      onChange(next);
    },
    [filters, onChange],
  );

  const removeFilter = useCallback(
    (index: number) => {
      onChange(filters.filter((_, i) => i !== index));
    },
    [filters, onChange],
  );

  const updateMultiselectOption = useCallback(
    (
      filterIndex: number,
      optIndex: number,
      patch: { label?: string; matchValue?: string },
    ) => {
      const f = filters[filterIndex];
      if (!f || f.type !== "multiselect") return;
      const opts = f.options.map((o, i) =>
        i === optIndex ? { ...o, ...patch } : o,
      );
      updateFilter(filterIndex, { options: opts });
    },
    [filters, updateFilter],
  );

  const addOption = useCallback(
    (filterIndex: number) => {
      const f = filters[filterIndex];
      if (!f || f.type !== "multiselect") return;
      updateFilter(filterIndex, {
        options: [
          ...f.options,
          { id: newId("opt"), label: "New option", matchValue: "General" },
        ],
      });
    },
    [filters, updateFilter],
  );

  const removeOption = useCallback(
    (filterIndex: number, optIndex: number) => {
      const f = filters[filterIndex];
      if (!f || f.type !== "multiselect") return;
      updateFilter(filterIndex, {
        options: f.options.filter((_, i) => i !== optIndex),
      });
    },
    [filters, updateFilter],
  );

  return (
    <div className="rounded-md border border-black/10 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 pb-4">
        <div>
          <h2 className="text-lg font-semibold">Storefront filters</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Controls the left sidebar on the full shop catalog. Match values
            must equal a product category, or use{" "}
            <code className="rounded bg-zinc-100 px-1">__sale__</code> for
            on-sale items.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={addMultiselect} type="button" variant="outline">
            Add multiselect
          </Button>
          <Button onClick={addPriceRange} type="button" variant="outline">
            Add price range
          </Button>
        </div>
      </div>

      <div className="mt-4 grid gap-6">
        {filters.length === 0 ? (
          <p className="text-sm text-zinc-500">No filters yet.</p>
        ) : (
          filters.map((f, fi) => (
            <div
              className="rounded-lg border border-zinc-200 bg-zinc-50/50 p-4"
              key={f.id}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="grid flex-1 gap-3 sm:grid-cols-2">
                  <Field label="Filter id (stable)">
                    <input
                      className="input font-mono text-sm"
                      onChange={(e) => updateFilter(fi, { id: e.target.value })}
                      value={f.id}
                    />
                  </Field>
                  <Field label="Label (shown in shop)">
                    <input
                      className="input"
                      onChange={(e) => updateFilter(fi, { label: e.target.value })}
                      value={f.label}
                    />
                  </Field>
                </div>
                <Button
                  className="shrink-0 text-red-600"
                  onClick={() => removeFilter(fi)}
                  type="button"
                  variant="ghost"
                >
                  Remove
                </Button>
              </div>

              {f.type === "multiselect" ? (
                <div className="mt-4 space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Options
                  </p>
                  {f.options.map((opt, oi) => (
                    <div
                      className="flex flex-wrap items-end gap-2 rounded-md border border-zinc-200 bg-white p-3"
                      key={opt.id}
                    >
                      <Field label="Option label">
                        <input
                          className="input"
                          onChange={(e) =>
                            updateMultiselectOption(fi, oi, {
                              label: e.target.value,
                            })
                          }
                          value={opt.label}
                        />
                      </Field>
                      <Field label="Match value (category or __sale__)">
                        <input
                          className="input font-mono text-sm"
                          onChange={(e) =>
                            updateMultiselectOption(fi, oi, {
                              matchValue: e.target.value,
                            })
                          }
                          value={opt.matchValue}
                        />
                      </Field>
                      <Button
                        onClick={() => removeOption(fi, oi)}
                        type="button"
                        variant="ghost"
                      >
                        ✕
                      </Button>
                    </div>
                  ))}
                  <Button
                    onClick={() => addOption(fi)}
                    type="button"
                    variant="outline"
                  >
                    Add option
                  </Button>
                </div>
              ) : (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <Field label="Min price (raw)">
                    <input
                      className="input"
                      inputMode="numeric"
                      onChange={(e) =>
                        updateFilter(fi, {
                          min: Number(e.target.value) || 0,
                        })
                      }
                      type="number"
                      value={f.min}
                    />
                  </Field>
                  <Field label="Max price (raw)">
                    <input
                      className="input"
                      inputMode="numeric"
                      onChange={(e) =>
                        updateFilter(fi, {
                          max: Number(e.target.value) || 0,
                        })
                      }
                      type="number"
                      value={f.max}
                    />
                  </Field>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
