"use client";

import * as React from "react";
import type { NewProductInput, ProductStatus } from "../../../types/index";

const defaultFormState: NewProductInput = {
  name: "",
  price: 0,
  stock: 0,
  image: "",
  status: "Active",
};

export function AddProductModal({
  open,
  onClose,
  onAdd,
  buttonColor,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (data: NewProductInput) => void;
  buttonColor: string;
}) {
  const [formState, setFormState] =
    React.useState<NewProductInput>(defaultFormState);

  React.useEffect(() => {
    if (!open) {
      setFormState(defaultFormState);
    }
  }, [open]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onAdd(formState);
    onClose();
  };

  const updateField = <K extends keyof NewProductInput>(
    field: K,
    value: NewProductInput[K],
  ) => {
    setFormState(
      (current) => ({ ...current, [field]: value }) as NewProductInput,
    );
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-6">
      <div className="w-full max-w-2xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-lg font-semibold text-slate-950">
            Add new product
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Create a product draft for the current shop. You can continue to
            update it later.
          </p>
        </div>
        <form className="space-y-5 px-6 py-6" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-slate-700">
              Product name
              <input
                value={formState.name}
                onChange={(event) => updateField("name", event.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                required
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              Price
              <input
                type="number"
                min={0}
                value={formState.price}
                onChange={(event) =>
                  updateField("price", Number(event.target.value))
                }
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                required
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-slate-700">
              Stock quantity
              <input
                type="number"
                min={0}
                value={formState.stock}
                onChange={(event) =>
                  updateField("stock", Number(event.target.value))
                }
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                required
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              Image URL
              <input
                value={formState.image}
                onChange={(event) => updateField("image", event.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                required
              />
            </label>
          </div>

          <label className="space-y-2 text-sm font-medium text-slate-700">
            Status
            <select
              value={formState.status}
              onChange={(event) =>
                updateField("status", event.target.value as ProductStatus)
              }
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400"
            >
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
            </select>
          </label>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-3xl border border-slate-200 bg-slate-100 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-3xl px-5 py-3 text-sm font-semibold text-white transition"
              style={{ backgroundColor: buttonColor }}
            >
              Add product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
