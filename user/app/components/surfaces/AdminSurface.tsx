"use client";

import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type {
  Order,
  OrderStatus,
  Product,
  ProductDraft,
  ShopTheme,
} from "@/types";
import { formatMoney } from "@/lib/utils";
import { Badge } from "@/ui";
import { ProductForm } from "@/app/components/admin/ProductForm";
import { ProductRow } from "@/app/components/admin/ProductRow";

type Props = {
  draft: ProductDraft;
  setDraft: Dispatch<SetStateAction<ProductDraft>>;
  products: Product[];
  orders: Order[];
  theme: ShopTheme;
  editingId: string | null;
  onAddProduct: () => void;
  onSaveEdit: (id: string) => void;
  onStartEdit: (product: Product) => void;
  onCancelEdit: () => void;
  onDeleteProduct: (id: string) => void;
  onUpdateInventory: (id: string, delta: number) => void;
  onToggleFeatured: (id: string) => void;
  onUpdateOrderStatus: (id: string, status: OrderStatus) => void;
};

export function AdminSurface({
  draft,
  setDraft,
  products,
  orders,
  theme,
  editingId,
  onAddProduct,
  onSaveEdit,
  onStartEdit,
  onCancelEdit,
  onDeleteProduct,
  onUpdateInventory,
  onToggleFeatured,
  onUpdateOrderStatus,
}: Props) {
  const [search, setSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()),
  );

  function handleDelete(id: string) {
    if (confirmDelete === id) {
      onDeleteProduct(id);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(id);
    }
  }

  const statusColors: Record<OrderStatus, "zinc" | "amber" | "green" | "red"> =
    {
      pending: "amber",
      fulfilled: "green",
      cancelled: "red",
    };

  return (
    <section className="grid gap-5 lg:grid-cols-[360px_1fr]">
      {/* Sidebar: Create product */}
      <div className="h-fit rounded-md border border-black/10 bg-white p-4 shadow-sm">
        <h2 className="text-base font-semibold tracking-normal">Add product</h2>
        <div className="mt-4">
          <ProductForm
            draft={draft}
            mode="create"
            onSubmit={onAddProduct}
            setDraft={setDraft}
            theme={theme}
          />
        </div>
      </div>

      <div className="grid gap-5">
        {/* Products list */}
        <div className="rounded-md border border-black/10 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 pb-3">
            <h2 className="text-base font-semibold">Products</h2>
            <span className="text-sm text-zinc-500">
              {products.length} total
            </span>
          </div>

          <div className="mt-3">
            <input
              className="input"
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or category…"
              value={search}
            />
          </div>

          <div className="mt-4 grid gap-3">
            {filtered.length > 0 ? (
              filtered.map((product) => (
                <div key={product.id}>
                  {confirmDelete === product.id && (
                    <div className="mb-2 flex items-center gap-2 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                      <span className="flex-1">Delete "{product.name}"?</span>
                      <button
                        className="font-semibold underline"
                        onClick={() => handleDelete(product.id)}
                        type="button"
                      >
                        Confirm
                      </button>
                      <button
                        className="text-red-500"
                        onClick={() => setConfirmDelete(null)}
                        type="button"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                  <ProductRow
                    draft={draft}
                    isEditing={editingId === product.id}
                    onCancel={onCancelEdit}
                    onDelete={() => handleDelete(product.id)}
                    onEdit={() => onStartEdit(product)}
                    onInventory={(delta) =>
                      onUpdateInventory(product.id, delta)
                    }
                    onSave={() => onSaveEdit(product.id)}
                    onToggleFeatured={() => onToggleFeatured(product.id)}
                    product={product}
                    setDraft={setDraft}
                    theme={theme}
                  />
                </div>
              ))
            ) : (
              <p className="rounded-md border border-zinc-100 p-4 text-sm text-zinc-400">
                No products match your search.
              </p>
            )}
          </div>
        </div>

        {/* Orders */}
        <div className="rounded-md border border-black/10 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-zinc-100 pb-3">
            <h2 className="text-base font-semibold">Orders</h2>
            <span className="text-sm text-zinc-500">{orders.length} total</span>
          </div>
          <div className="mt-4 grid gap-3">
            {orders.length > 0 ? (
              orders.map((order) => (
                <div
                  className="grid gap-2 rounded-md border border-zinc-200 p-3 text-sm sm:grid-cols-[1fr_auto]"
                  key={order.id}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{order.id}</p>
                      <Badge color={statusColors[order.status]}>
                        {order.status}
                      </Badge>
                    </div>
                    <p className="mt-1 text-zinc-500">
                      {order.buyerName} · {order.buyerEmail}
                    </p>
                    <p className="mt-0.5 text-zinc-400 text-xs">
                      {order.createdAt}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <p className="font-semibold">
                      {formatMoney(order.total, theme.currency)}
                    </p>
                    <p className="text-zinc-500">{order.itemCount} items</p>
                    <select
                      className="rounded border border-zinc-200 bg-white px-2 py-1 text-xs"
                      onChange={(e) =>
                        onUpdateOrderStatus(
                          order.id,
                          e.target.value as OrderStatus,
                        )
                      }
                      value={order.status}
                    >
                      <option value="pending">Pending</option>
                      <option value="fulfilled">Fulfilled</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-zinc-400">
                Orders appear after checkout.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
