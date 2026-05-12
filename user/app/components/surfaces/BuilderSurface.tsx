"use client";

import { useMemo, useState } from "react";
import { Field, ColorField } from "@/ui";
import { Separator } from "@/ui/separator";
import { ShopHero, ProductShelf } from "@/app/components/shop";
import type { CartItem, Product, ShopTheme } from "@/types";
import { formatMoney } from "@/lib/utils";

const CURRENCIES = ["₮", "$", "€", "£", "¥"] as const;
const FONTS = [
  { label: "System sans-serif", value: "sans" },
  { label: "Serif", value: "serif" },
  { label: "Monospace", value: "mono" },
] as const;

type Props = {
  featuredProducts: Product[];
  products: Product[];
  theme: ShopTheme;
  updateTheme: <K extends keyof ShopTheme>(key: K, value: ShopTheme[K]) => void;

  addToCart: (id: string) => void;
  removeFromCart: (id: string) => void;
  clearCartItem: (id: string) => void;
  cartItems: CartItem[];
  cartTotal: number;
  buyerName: string;
  setBuyerName: (value: string) => void;
  buyerEmail: string;
  setBuyerEmail: (value: string) => void;
  checkout: () => void;
  lastOrderId: string;
};

export function BuilderSurface({
  featuredProducts,
  products,
  theme,
  updateTheme,
  addToCart,
  removeFromCart,
  clearCartItem,
  cartItems,
  cartTotal,
  buyerName,
  setBuyerName,
  buyerEmail,
  setBuyerEmail,
  checkout,
  lastOrderId,
}: Props) {
  const [categoryFilter, setCategoryFilter] = useState<string>("All");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.map((p) => p.category)))],
    [products],
  );

  const filtered =
    categoryFilter === "All"
      ? products
      : products.filter((p) => p.category === categoryFilter);

  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  return (
    <section className="grid gap-5 lg:grid-cols-[minmax(380px,34%)_1fr]">
      <div className="h-fit rounded-md border border-black/10 bg-white p-4 shadow-sm">
        <h2 className="text-base font-semibold">Theme controls</h2>

        <div className="mt-4 grid gap-4">
          <div className="border-b border-zinc-100 pb-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Identity
            </p>
            <div className="grid gap-3">
              <Field label="Shop name">
                <input
                  className="input"
                  onChange={(e) => updateTheme("name", e.target.value)}
                  value={theme.name}
                />
              </Field>
              <Field label="Tagline">
                <textarea
                  className="input min-h-16 resize-none"
                  onChange={(e) => updateTheme("tagline", e.target.value)}
                  value={theme.tagline}
                />
              </Field>
              <Field label="Announcement bar">
                <input
                  className="input"
                  onChange={(e) => updateTheme("announcement", e.target.value)}
                  value={theme.announcement}
                />
              </Field>
            </div>
          </div>

          <div className="border-b border-zinc-100 pb-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Media
            </p>
            <Field label="Hero image (Unsplash URL)">
              <input
                className="input"
                onChange={(e) => updateTheme("heroImage", e.target.value)}
                value={theme.heroImage}
              />
            </Field>
          </div>

          <div className="border-b border-zinc-100 pb-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Colors
            </p>
            <div className="grid grid-cols-2 gap-3">
              <ColorField
                label="Primary"
                onChange={(v) => updateTheme("primaryColor", v)}
                value={theme.primaryColor}
              />
              <ColorField
                label="Accent"
                onChange={(v) => updateTheme("accentColor", v)}
                value={theme.accentColor}
              />
              <ColorField
                label="Background"
                onChange={(v) => updateTheme("backgroundColor", v)}
                value={theme.backgroundColor}
              />
              <ColorField
                label="Text"
                onChange={(v) => updateTheme("textColor", v)}
                value={theme.textColor}
              />
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Style
            </p>
            <div className="grid gap-3">
              <Field label="Product layout">
                <select
                  className="input"
                  onChange={(e) =>
                    updateTheme("layout", e.target.value as ShopTheme["layout"])
                  }
                  value={theme.layout}
                >
                  <option value="grid">Grid</option>
                  <option value="editorial">Editorial</option>
                </select>
              </Field>

              <Field label="Font family">
                <select
                  className="input"
                  onChange={(e) => updateTheme("font", e.target.value)}
                  value={theme.font}
                >
                  {FONTS.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label={`Corner radius — ${theme.radius}px`}>
                <input
                  className="w-full accent-current"
                  max="20"
                  min="0"
                  onChange={(e) => updateTheme("radius", Number(e.target.value))}
                  style={{ accentColor: theme.primaryColor }}
                  type="range"
                  value={theme.radius}
                />
              </Field>

              <Field label="Currency">
                <div className="flex gap-2">
                  {CURRENCIES.map((c) => (
                    <button
                      className="flex-1 rounded-md border py-2 text-sm font-semibold transition"
                      key={c}
                      onClick={() => updateTheme("currency", c)}
                      style={
                        theme.currency === c
                          ? {
                              backgroundColor: theme.primaryColor,
                              color: "#fff",
                              borderColor: theme.primaryColor,
                            }
                          : { borderColor: "#d4d4d8", color: "#52525b" }
                      }
                      type="button"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </Field>
            </div>
          </div>

          <Separator className="my-2" />

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Storefront demo
            </p>
            <div className="grid gap-3">
              <Field label="Preview category">
                <select
                  className="input"
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  value={categoryFilter}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </Field>

              <div className="rounded-md border border-zinc-200 bg-white p-3 text-sm">
                <div className="flex items-center justify-between gap-3 border-b border-zinc-100 pb-3">
                  <p className="font-semibold">Cart</p>
                  {cartCount > 0 && (
                    <span
                      className="rounded-full px-2.5 py-0.5 text-xs font-bold text-white"
                      style={{ backgroundColor: theme.primaryColor }}
                    >
                      {cartCount}
                    </span>
                  )}
                </div>

                <div className="mt-3 grid gap-2">
                  {cartItems.length > 0 ? (
                    cartItems.map((item) => {
                      const effectivePrice =
                        item.product.salePrice ?? item.product.price;
                      return (
                        <div
                          className="rounded-md border border-zinc-200 p-2"
                          key={item.product.id}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium">
                                {item.product.name}
                              </p>
                              <p className="mt-0.5 text-xs text-zinc-500">
                                {formatMoney(effectivePrice, theme.currency)} each
                              </p>
                            </div>
                            <button
                              className="text-xs text-zinc-400 transition hover:text-red-500"
                              onClick={() => clearCartItem(item.product.id)}
                              type="button"
                            >
                              ✕
                            </button>
                          </div>
                          <div className="mt-2 flex items-center gap-2">
                            <button
                              className="control-button"
                              onClick={() => removeFromCart(item.product.id)}
                              type="button"
                            >
                              −
                            </button>
                            <span className="min-w-6 text-center text-sm font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              className="control-button"
                              disabled={item.quantity >= item.product.inventory}
                              onClick={() => addToCart(item.product.id)}
                              type="button"
                            >
                              +
                            </button>
                            <span className="ml-auto text-sm font-semibold">
                              {formatMoney(
                                effectivePrice * item.quantity,
                                theme.currency,
                              )}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="rounded-md border border-zinc-100 p-3 text-sm text-zinc-400">
                      Your cart is empty.
                    </p>
                  )}
                </div>

                <div className="mt-3 border-t border-zinc-100 pt-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-500">Total</span>
                    <strong>{formatMoney(cartTotal, theme.currency)}</strong>
                  </div>

                  <div className="mt-3 grid gap-3">
                    <Field label="Your name">
                      <input
                        className="input"
                        onChange={(e) => setBuyerName(e.target.value)}
                        placeholder="Full name"
                        value={buyerName}
                      />
                    </Field>
                    <Field label="Email (optional)">
                      <input
                        className="input"
                        onChange={(e) => setBuyerEmail(e.target.value)}
                        placeholder="you@email.com"
                        type="email"
                        value={buyerEmail}
                      />
                    </Field>
                    <button
                      className="w-full rounded-md px-3 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                      disabled={cartItems.length === 0 || !buyerName.trim()}
                      onClick={checkout}
                      style={{ backgroundColor: theme.primaryColor }}
                      type="button"
                    >
                      Place order — {formatMoney(cartTotal, theme.currency)}
                    </button>
                  </div>

                  {lastOrderId && (
                    <div className="mt-3 rounded-md border border-emerald-100 bg-emerald-50 px-3 py-2.5 text-sm text-emerald-800">
                      <p className="font-semibold">Order placed! 🎉</p>
                      <p className="mt-0.5 text-emerald-600">{lastOrderId}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-md border border-black/10 bg-white shadow-sm">
        <ShopHero
          heroImages={[
            theme.heroImage,
            ...featuredProducts.map((p) => p.image),
          ].filter(Boolean)}
          theme={theme}
        />
        <ProductShelf
          mode="preview"
          products={filtered}
          theme={theme}
          title={categoryFilter === "All" ? "All products" : categoryFilter}
        />
      </div>
    </section>
  );
}
