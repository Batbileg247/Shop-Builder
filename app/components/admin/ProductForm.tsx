"use client";

import Image from "next/image";
import type { Dispatch, SetStateAction } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Field } from "@/components/ui";
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
};

export function ProductForm({
  draft,
  setDraft,
  onSubmit,
  onCancel,
  theme,
  mode,
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
      <div>
        <p className="text-xs font-medium text-zinc-500">
          Swipe samples or tap one to set the image URL — your live preview is the
          first slide.
        </p>
        <Carousel className="mt-2 w-full">
          <CarouselContent>
            <CarouselItem className="basis-[88%] pl-2 sm:basis-[70%] sm:pl-4">
              <div
                className="overflow-hidden border border-zinc-200 bg-white shadow-sm"
                style={{ borderRadius: theme.radius }}
              >
                <div className="relative aspect-[4/3] bg-zinc-100">
                  <Image
                    alt={draft.name || "Preview"}
                    className="object-cover"
                    fill
                    sizes="280px"
                    src={safeImage(draft.image)}
                  />
                  {saleNum != null && (
                    <div
                      className="absolute left-2 top-2 rounded px-2 py-0.5 text-xs font-bold text-white"
                      style={{ backgroundColor: theme.accentColor }}
                    >
                      SALE
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-xs uppercase tracking-wider text-zinc-400">
                    {draft.category || "Category"}
                  </p>
                  <p className="mt-0.5 text-sm font-semibold">
                    {draft.name || "Product name"}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500 line-clamp-2">
                    {draft.description || "Description preview"}
                  </p>
                  <p className="mt-2 text-sm font-semibold">
                    {formatMoney(displayPrice, theme.currency)}
                    {saleNum != null && (
                      <span className="ml-2 text-xs font-normal text-zinc-400 line-through">
                        {formatMoney(draft.price, theme.currency)}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </CarouselItem>
            {SAMPLE_IMAGES.map((url) => (
              <CarouselItem
                className="basis-[72%] pl-2 sm:basis-[45%] sm:pl-4"
                key={url}
              >
                <button
                  className={`relative aspect-[4/3] w-full overflow-hidden rounded-md border-2 bg-zinc-100 transition ${
                    draft.image === url
                      ? "border-emerald-600 ring-2 ring-emerald-600/20"
                      : "border-transparent hover:border-zinc-300"
                  }`}
                  onClick={() => update("image", url)}
                  type="button"
                >
                  <Image
                    alt=""
                    className="object-cover"
                    fill
                    sizes="200px"
                    src={safeImage(url)}
                  />
                </button>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-0 border-zinc-200 bg-white shadow-sm sm:left-1" />
          <CarouselNext className="right-0 border-zinc-200 bg-white shadow-sm sm:right-1" />
        </Carousel>
      </div>

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
          <input
            className="input"
            onChange={(e) => update("category", e.target.value)}
            placeholder="e.g. Apparel"
            value={draft.category}
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

      <Field label="Image URL (Unsplash only)">
        <input
          className="input"
          onChange={(e) => update("image", e.target.value)}
          placeholder="https://images.unsplash.com/..."
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
