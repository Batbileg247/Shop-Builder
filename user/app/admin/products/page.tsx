"use client";

import * as React from "react";
import {
  Download,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";
import type { NewProductInput, Product, ProductStatus } from "@/types/dashboard";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("en-US");

const defaultProductForm: NewProductInput = {
  name: "",
  sku: "",
  description: "",
  imageUrl: "",
  status: "Live",
  price: 0,
  inventory: 0,
};

function StatusBadge({ status }: { status: ProductStatus }) {
  const classes =
    status === "Live"
      ? "bg-blue-50 text-blue-500 ring-blue-100"
      : "bg-slate-100 text-slate-400 ring-slate-200";

  return (
    <span
      className={`inline-flex min-w-16 justify-center rounded-full px-3 py-1 text-xs font-bold ring-1 ${classes}`}
    >
      {status}
    </span>
  );
}

function ProductModal({
  open,
  onClose,
  onSubmit,
  brandColor,
  product,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (product: NewProductInput) => void;
  brandColor: string;
  product?: Product | null;
}) {
  const [form, setForm] = React.useState<NewProductInput>(defaultProductForm);
  const isEditing = Boolean(product);

  React.useEffect(() => {
    if (!open) {
      setForm(defaultProductForm);
      return;
    }

    if (product) {
      setForm({
        name: product.name,
        sku: product.sku,
        description: product.description,
        imageUrl: product.imageUrl,
        status: product.status,
        price: product.price,
        inventory: product.inventory,
      });
    }
  }, [open, product]);

  if (!open) {
    return null;
  }

  const updateField = <Key extends keyof NewProductInput>(
    key: Key,
    value: NewProductInput[Key],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_90px_rgba(15,23,42,0.18)]">
        <div className="flex items-start justify-between gap-6 px-7 py-6">
          <div>
            <p className="text-sm font-bold text-slate-400">
              {isEditing ? "Edit listing" : "New listing"}
            </p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">
              {isEditing ? "Update Product" : "Add Product"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          className="space-y-5 px-7 pb-7"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit(form);
            onClose();
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm font-bold text-slate-500">
              Product name
              <input
                required
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                className="h-12 w-full rounded-2xl border border-slate-100 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-slate-200 focus:bg-white focus:ring-4 focus:ring-slate-100"
              />
            </label>
            <label className="space-y-2 text-sm font-bold text-slate-500">
              SKU
              <input
                required
                value={form.sku}
                onChange={(event) => updateField("sku", event.target.value)}
                className="h-12 w-full rounded-2xl border border-slate-100 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-slate-200 focus:bg-white focus:ring-4 focus:ring-slate-100"
              />
            </label>
          </div>

          <label className="space-y-2 text-sm font-bold text-slate-500">
            Description
            <textarea
              required
              value={form.description}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              className="min-h-24 w-full resize-none rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-slate-200 focus:bg-white focus:ring-4 focus:ring-slate-100"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="space-y-2 text-sm font-bold text-slate-500">
              Price
              <input
                required
                type="number"
                min={0}
                value={form.price}
                onChange={(event) =>
                  updateField("price", Number(event.target.value))
                }
                className="h-12 w-full rounded-2xl border border-slate-100 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-slate-200 focus:bg-white focus:ring-4 focus:ring-slate-100"
              />
            </label>
            <label className="space-y-2 text-sm font-bold text-slate-500">
              Inventory
              <input
                required
                type="number"
                min={0}
                value={form.inventory}
                onChange={(event) =>
                  updateField("inventory", Number(event.target.value))
                }
                className="h-12 w-full rounded-2xl border border-slate-100 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-slate-200 focus:bg-white focus:ring-4 focus:ring-slate-100"
              />
            </label>
            <label className="space-y-2 text-sm font-bold text-slate-500">
              Status
              <select
                value={form.status}
                onChange={(event) =>
                  updateField("status", event.target.value as ProductStatus)
                }
                className="h-12 w-full rounded-2xl border border-slate-100 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-slate-200 focus:bg-white focus:ring-4 focus:ring-slate-100"
              >
                <option value="Live">Live</option>
                <option value="Draft">Draft</option>
              </select>
            </label>
          </div>

          <label className="space-y-2 text-sm font-bold text-slate-500">
            Image URL
            <input
              value={form.imageUrl}
              onChange={(event) => updateField("imageUrl", event.target.value)}
              placeholder="Optional Unsplash or product image URL"
              className="h-12 w-full rounded-2xl border border-slate-100 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-slate-200 focus:bg-white focus:ring-4 focus:ring-slate-100"
            />
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="h-12 rounded-2xl bg-slate-50 px-5 text-sm font-bold text-slate-500 transition hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-12 rounded-2xl px-6 text-sm font-black text-white shadow-lg transition hover:opacity-90"
              style={{
                backgroundColor: brandColor,
                boxShadow: `0 18px 34px ${brandColor}33`,
              }}
            >
              {isEditing ? "Save Changes" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ProductThumbnail({ product }: { product: Product }) {
  return (
    <div className="h-14 w-14 overflow-hidden rounded-2xl bg-slate-100">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="h-full w-full object-cover"
      />
    </div>
  );
}

export default function ProductsPage() {
  const { activeShop, products, addProduct, updateProduct, deleteProduct } =
    useDashboard();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(
    null,
  );
  const [search, setSearch] = React.useState("");

  const openAddModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const saveProduct = (data: NewProductInput) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, data);
      return;
    }

    addProduct(data);
  };

  const filteredProducts = React.useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return products;
    }

    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.sku.toLowerCase().includes(normalizedSearch),
    );
  }, [products, search]);

  return (
    <>
      <div className="space-y-8">
        <header className="overflow-hidden rounded-[2rem] bg-white px-6 py-6 shadow-[0_24px_70px_rgba(15,23,42,0.07)] sm:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-bold text-slate-400">
                Product Management
              </p>
              <h1 className="mt-2 text-3xl font-black text-slate-950 sm:text-4xl">
                {activeShop.name}
              </h1>
              <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-slate-400">
                Manage product visibility, shop-specific sales data, and local
                catalog updates from one polished admin surface.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="flex h-12 items-center gap-2 rounded-2xl bg-slate-50 px-4 text-sm font-bold text-slate-500 transition hover:bg-slate-100"
              >
                <Download className="h-4 w-4" />
                Export
              </button>
              <button
                type="button"
                onClick={openAddModal}
                className="flex h-12 items-center gap-2 rounded-2xl px-5 text-sm font-black text-white shadow-lg transition hover:opacity-90"
                style={{
                  backgroundColor: activeShop.brandColor,
                  boxShadow: `0 18px 34px ${activeShop.brandColor}33`,
                }}
              >
                <Plus className="h-4 w-4" />
                Add Product
              </button>
            </div>
          </div>
        </header>

        <section className="rounded-[2rem] bg-white p-5 shadow-[0_24px_70px_rgba(15,23,42,0.07)] sm:p-7">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-bold text-slate-400">
                Top Selling Products
              </p>
              <h2 className="mt-1 text-2xl font-black text-slate-950">
                Catalog performance
              </h2>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search product or SKU"
                className="h-12 w-full rounded-2xl border border-slate-100 bg-slate-50 pl-11 pr-4 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-slate-200 focus:bg-white focus:ring-4 focus:ring-slate-100"
              />
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-[860px] w-full border-separate border-spacing-y-3 text-left">
              <thead>
                <tr className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                  <th className="px-4 py-2">Product</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Sales</th>
                  <th className="px-4 py-2">Earning</th>
                  <th className="px-4 py-2">Stock</th>
                  <th className="px-4 py-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="rounded-[1.5rem] bg-slate-50/70 text-sm font-bold text-slate-700"
                  >
                    <td className="rounded-l-[1.5rem] px-4 py-4">
                      <div className="flex items-center gap-4">
                        <ProductThumbnail product={product} />
                        <div>
                          <p className="font-black text-slate-950">
                            {product.name}
                          </p>
                          <p className="mt-1 text-xs font-bold text-slate-400">
                            {product.sku}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={product.status} />
                    </td>
                    <td className="px-4 py-4 text-slate-950">
                      {numberFormatter.format(product.sales)}
                    </td>
                    <td className="px-4 py-4 text-slate-950">
                      {currencyFormatter.format(product.earning)}
                    </td>
                    <td className="px-4 py-4 text-slate-400">
                      {numberFormatter.format(product.inventory)}
                    </td>
                    <td className="rounded-r-[1.5rem] px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          aria-label={`Edit ${product.name}`}
                          onClick={() => openEditModal(product)}
                          className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-300 transition hover:text-slate-700"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          aria-label={`Delete ${product.name}`}
                          onClick={() => deleteProduct(product.id)}
                          className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-300 transition hover:text-rose-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredProducts.length === 0 ? (
              <div className="rounded-[1.5rem] bg-slate-50 px-6 py-12 text-center">
                <p className="text-sm font-bold text-slate-400">
                  No products match this search.
                </p>
              </div>
            ) : null}
          </div>
        </section>

      </div>

      <ProductModal
        open={isModalOpen}
        onClose={closeModal}
        onSubmit={saveProduct}
        brandColor={activeShop.brandColor}
        product={editingProduct}
      />
    </>
  );
}
