"use client";

import Image from "next/image";
import type { Dispatch, SetStateAction } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/ui/carousel";
import { Field } from "@/ui";
import type { ProductDraft, ShopTheme } from "@/types";
import { formatMoney, safeImage } from "@/lib/utils";

const SAMPLE_IMAGES = [
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=1000&q=80",
] as const;

type Props = {
  draft: ProductDraft;
  setDraft: Dispatch<SetStateAction<ProductDraft>>;
  onSubmit: () => void;
  onCancel?: () => void;
  theme: ShopTheme;
  mode: "create" | "edit";
  /** When set (e.g. theme studio), category is chosen from this list only. */
  categoryOptions?: readonly string[];
};

export function ProductForm({
  draft,
  setDraft,
  onSubmit,
  onCancel,
  theme,
  mode,
  categoryOptions,
}: Props) {
  const update = <K extends keyof ProductDraft>(
    key: K,
    value: ProductDraft[K],
  ) => setDraft((d) => ({ ...d, [key]: value }));

  const saleNum =
    draft.salePrice === "" ? undefined : Number(draft.salePrice) || undefined;
  const displayPrice = saleNum ?? draft.price;

  return (
    <div className="grid gap-4">
      <Field label="Name">
        <input
          className="input"
          onChange={(e) => update("name", e.target.value)}
          placeholder="Product name"
          value={draft.name}
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Category">
          {categoryOptions !== undefined ? (
            <>
              <select
                className="input"
                disabled={categoryOptions.length === 0}
                onChange={(e) => update("category", e.target.value)}
                value={draft.category}
              >
                <option value="">Select a category</option>
                {draft.category &&
                !categoryOptions.includes(draft.category) ? (
                  <option value={draft.category}>{draft.category}</option>
                ) : null}
                {categoryOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {categoryOptions.length === 0 ? (
                <p className="mt-1.5 text-xs font-medium text-amber-800">
                  Use the + button next to the category filters in the preview to
                  add one first.
                </p>
              ) : null}
            </>
          ) : (
            <input
              className="input"
              onChange={(e) => update("category", e.target.value)}
              placeholder="e.g. Apparel"
              value={draft.category}
            />
          )}
        </Field>
        <Field label="Size">
          <input
            className="input"
            onChange={(e) => update("size", e.target.value)}
            placeholder="e.g. M, 42, One size"
            value={draft.size}
          />
        </Field>
      </div>

      <Field label="Description">
        <textarea
          className="input min-h-16 resize-none"
          onChange={(e) => update("description", e.target.value)}
          placeholder="Short product description"
          value={draft.description}
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Price">
          <input
            className="input"
            min="0"
            onChange={(e) => update("price", Number(e.target.value))}
            type="number"
            value={draft.price}
          />
        </Field>
        <Field label="Sale price (optional)">
          <input
            className="input"
            min="0"
            onChange={(e) => update("salePrice", e.target.value)}
            placeholder="Leave blank if none"
            type="number"
            value={draft.salePrice}
          />
        </Field>
      </div>

      <Field label="Inventory">
        <input
          className="input"
          min="0"
          onChange={(e) => update("inventory", Number(e.target.value))}
          type="number"
          value={draft.inventory}
        />
      </Field>

      <Field label="Featured">
        <select
          className="input"
          onChange={(e) =>
            update("featured", e.target.value as ProductDraft["featured"])
          }
          value={draft.featured}
        >
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      </Field>

      <Field label="Image URL or upload path">
        <input
          className="input"
          onChange={(e) => update("image", e.target.value)}
          placeholder="https://… or /path or data URL"
          value={draft.image}
        />
      </Field>

      <div className="flex gap-2">
        <button
          className="flex-1 rounded-md px-3 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          onClick={onSubmit}
          style={{ backgroundColor: theme.primaryColor }}
          type="button"
        >
          {mode === "create" ? "Add product" : "Save changes"}
        </button>
        {onCancel && (
          <button
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
            onClick={onCancel}
            type="button"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
