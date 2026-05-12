import Image from "next/image";
import type { Dispatch, SetStateAction } from "react";
import type { Product, ProductDraft, ShopTheme } from "@/types";
import { safeImage, formatMoney } from "@/lib/utils";
import { Badge } from "@/ui";
import { ProductForm } from "@/app/components/admin/ProductForm";

type Props = {
  product: Product;
  theme: ShopTheme;
  isEditing: boolean;
  draft: ProductDraft;
  setDraft: Dispatch<SetStateAction<ProductDraft>>;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
  onToggleFeatured: () => void;
  onInventory: (delta: number) => void;
};

export function ProductRow({
  product,
  theme,
  isEditing,
  draft,
  setDraft,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onToggleFeatured,
  onInventory,
}: Props) {
  const stockColor =
    product.inventory === 0 ? "red" : product.inventory < 5 ? "amber" : "green";

  return (
    <div className="rounded-md border border-zinc-200 bg-white overflow-hidden">
      {/* Header row */}
      <div className="grid gap-3 p-3 sm:grid-cols-[72px_1fr_auto]">
        <div
          className="relative h-[72px] min-h-[72px] w-[72px] overflow-hidden bg-zinc-100"
          style={{ borderRadius: theme.radius }}
        >
          <Image
            alt={product.name}
            className="object-cover"
            fill
            sizes="72px"
            src={safeImage(product.image)}
          />
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold truncate">{product.name}</p>
            {product.featured && <Badge color="blue">Featured</Badge>}
          </div>
          <p className="mt-0.5 text-xs text-zinc-500">{product.category}</p>
          <div className="mt-1 flex items-center gap-2">
            {product.salePrice ? (
              <>
                <span className="text-sm font-semibold text-emerald-600">
                  {formatMoney(product.salePrice, theme.currency)}
                </span>
                <span className="text-xs text-zinc-400 line-through">
                  {formatMoney(product.price, theme.currency)}
                </span>
              </>
            ) : (
              <span className="text-sm font-medium">
                {formatMoney(product.price, theme.currency)}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-start gap-2">
          {/* Inventory */}
          <div className="flex items-center gap-1.5">
            <button
              className="control-button"
              onClick={() => onInventory(-1)}
              type="button"
            >
              −
            </button>
            <Badge color={stockColor}>{product.inventory}</Badge>
            <button
              className="control-button"
              onClick={() => onInventory(1)}
              type="button"
            >
              +
            </button>
          </div>

          {/* Actions */}
          <button
            className="control-button"
            onClick={onToggleFeatured}
            type="button"
          >
            {product.featured ? "Unfeature" : "Feature"}
          </button>
          <button className="control-button" onClick={onEdit} type="button">
            Edit
          </button>
          <button
            className="control-button text-red-600 hover:border-red-200 hover:bg-red-50"
            onClick={onDelete}
            type="button"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Inline edit form */}
      {isEditing && (
        <div className="border-t border-zinc-100 bg-zinc-50 p-4">
          <p className="mb-3 text-sm font-semibold text-zinc-700">
            Edit product
          </p>
          <ProductForm
            draft={draft}
            mode="edit"
            onCancel={onCancel}
            onSubmit={onSave}
            setDraft={setDraft}
            theme={theme}
          />
        </div>
      )}
    </div>
  );
}
