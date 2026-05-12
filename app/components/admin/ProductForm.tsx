import type { Dispatch, SetStateAction } from "react";
import { Field } from "../ui";
import { ProductDraft, ShopTheme } from "@/types";

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
