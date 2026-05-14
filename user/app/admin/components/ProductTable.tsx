"use client";

import * as React from "react";
import { Check, Pencil, Trash2 } from "lucide-react";
import type { Product, ProductStatus } from "@/types/dashboard";
import { useDashboard } from "@/context/DashboardContext";

function StatusPill({ status }: { status: ProductStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        status === "Live"
          ? "bg-emerald-100 text-emerald-700"
          : "bg-slate-100 text-slate-700"
      }`}
    >
      {status}
    </span>
  );
}

export function ProductTable() {
  const { products, updateProduct, deleteProduct } = useDashboard();
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [draft, setDraft] = React.useState<Partial<Product>>({});

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setDraft(product);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft({});
  };

  const saveEdit = () => {
    if (
      !editingId ||
      !draft.name ||
      draft.price == null ||
      draft.inventory == null
    ) {
      return;
    }
    updateProduct(editingId, {
      name: draft.name,
      price: Number(draft.price),
      inventory: Number(draft.inventory),
      imageUrl: draft.imageUrl ?? "",
      status: draft.status ?? "Draft",
    });
    cancelEdit();
  };

  return (
    <div id="products" className="space-y-4 px-6 py-6">
      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-slate-700">
            <thead>
              <tr className="border-b border-slate-200 text-slate-900">
                <th className="py-4 pr-6 font-semibold">Product</th>
                <th className="py-4 pr-6 font-semibold">Price</th>
                <th className="py-4 pr-6 font-semibold">Stock</th>
                <th className="py-4 pr-6 font-semibold">Status</th>
                <th className="py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {products.map((product) => {
                const isEditing = editingId === product.id;
                return (
                  <tr key={product.id} className="bg-white">
                    <td className="py-4 pr-6 align-top">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-14 w-14 rounded-3xl object-cover"
                        />
                        <div>
                          {isEditing ? (
                            <input
                              value={draft.name || ""}
                              onChange={(event) =>
                                setDraft((current) => ({
                                  ...current,
                                  name: event.target.value,
                                }))
                              }
                              className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none"
                            />
                          ) : (
                            <p className="font-medium text-slate-950">
                              {product.name}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pr-6 align-top">
                      {isEditing ? (
                        <input
                          type="number"
                          min={0}
                          value={draft.price ?? product.price}
                          onChange={(event) =>
                            setDraft((current) => ({
                              ...current,
                              price: Number(event.target.value),
                            }))
                          }
                          className="w-24 rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none"
                        />
                      ) : (
                        <span className="text-slate-800">${product.price}</span>
                      )}
                    </td>
                    <td className="py-4 pr-6 align-top">
                      {isEditing ? (
                        <input
                          type="number"
                          min={0}
                          value={draft.inventory ?? product.inventory}
                          onChange={(event) =>
                            setDraft((current) => ({
                              ...current,
                              inventory: Number(event.target.value),
                            }))
                          }
                          className="w-20 rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none"
                        />
                      ) : (
                        <span>{product.inventory}</span>
                      )}
                    </td>
                    <td className="py-4 pr-6 align-top">
                      {isEditing ? (
                        <select
                          value={draft.status ?? product.status}
                          onChange={(event) =>
                            setDraft((current) => ({
                              ...current,
                              status: event.target.value as ProductStatus,
                            }))
                          }
                          className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none"
                        >
                          <option value="Live">Live</option>
                          <option value="Draft">Draft</option>
                        </select>
                      ) : (
                        <StatusPill status={product.status} />
                      )}
                    </td>
                    <td className="py-4 align-top text-right">
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="rounded-3xl border border-slate-200 bg-slate-100 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={saveEdit}
                            className="inline-flex items-center gap-2 rounded-3xl bg-slate-950 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                          >
                            <Check className="h-4 w-4" /> Save
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(product)}
                            className="rounded-3xl border border-slate-200 bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-200"
                          >
                            <Pencil className="inline h-3.5 w-3.5" /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteProduct(product.id)}
                            className="rounded-3xl border border-slate-200 bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-200"
                          >
                            <Trash2 className="inline h-3.5 w-3.5" /> Remove
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
