"use client";

import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { CartItem, Product, ShopTheme } from "@/types";
import { formatMoney } from "@/lib/utils";
import { Field } from "@/ui";
import { ShopHero, ProductShelf } from "@/app/components/shop";

type Props = {
  addToCart: (id: string) => void;
  removeFromCart: (id: string) => void;
  clearCartItem: (id: string) => void;
  buyerEmail: string;
  buyerName: string;
  cartItems: CartItem[];
  cartTotal: number;
  checkout: () => void;
  lastOrderId: string;
  products: Product[];
  setBuyerEmail: Dispatch<SetStateAction<string>>;
  setBuyerName: Dispatch<SetStateAction<string>>;
  theme: ShopTheme;
};

export function ClientSurface({
  addToCart,
  removeFromCart,
  clearCartItem,
  buyerEmail,
  buyerName,
  cartItems,
  cartTotal,
  checkout,
  lastOrderId,
  products,
  setBuyerEmail,
  setBuyerName,
  theme,
}: Props) {
  const [categoryFilter, setCategoryFilter] = useState<string>("All");

  const categories = [
    "All",
    ...Array.from(new Set(products.map((p) => p.category))),
  ];

  const filtered =
    categoryFilter === "All"
      ? products
      : products.filter((p) => p.category === categoryFilter);

  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  return (
    <section className="grid gap-5 xl:grid-cols-[1fr_360px]">
      {/* Storefront */}
      <div className="overflow-hidden rounded-md border border-black/10 bg-white shadow-sm">
        <ShopHero theme={theme} />

        {/* Category filter bar */}
        <div className="flex gap-2 overflow-x-auto border-b border-zinc-100 px-4 py-3 sm:px-5">
          {categories.map((cat) => (
            <button
              className="shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition"
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              style={
                categoryFilter === cat
                  ? { backgroundColor: theme.primaryColor, color: "#fff" }
                  : { backgroundColor: "#f4f4f5", color: "#52525b" }
              }
              type="button"
            >
              {cat}
            </button>
          ))}
        </div>

        <ProductShelf
          addToCart={addToCart}
          mode="shop"
          products={filtered}
          theme={theme}
          title={categoryFilter === "All" ? "All products" : categoryFilter}
        />
      </div>

      {/* Cart */}
      <aside className="h-fit rounded-md border border-black/10 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-zinc-100 pb-3">
          <h2 className="text-base font-semibold">Cart</h2>
          {cartCount > 0 && (
            <span
              className="rounded-full px-2.5 py-0.5 text-xs font-bold text-white"
              style={{ backgroundColor: theme.primaryColor }}
            >
              {cartCount}
            </span>
          )}
        </div>

        <div className="mt-4 grid gap-3">
          {cartItems.length > 0 ? (
            cartItems.map((item) => {
              const effectivePrice =
                item.product.salePrice ?? item.product.price;
              return (
                <div
                  className="rounded-md border border-zinc-200 p-3 text-sm"
                  key={item.product.id}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-medium">
                        {item.product.name}
                      </p>
                      <p className="mt-0.5 text-zinc-500">
                        {formatMoney(effectivePrice, theme.currency)} each
                      </p>
                    </div>
                    <button
                      className="text-xs text-zinc-400 hover:text-red-500 transition"
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
            <p className="rounded-md border border-zinc-100 p-4 text-sm text-zinc-400">
              Your cart is empty.
            </p>
          )}
        </div>

        <div className="mt-4 border-t border-zinc-100 pt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-500">Total</span>
            <strong className="text-base">
              {formatMoney(cartTotal, theme.currency)}
            </strong>
          </div>

          <div className="mt-4 grid gap-3">
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
            <div className="mt-3 rounded-md bg-emerald-50 border border-emerald-100 px-3 py-2.5 text-sm text-emerald-800">
              <p className="font-semibold">Order placed! 🎉</p>
              <p className="mt-0.5 text-emerald-600">{lastOrderId}</p>
            </div>
          )}
        </div>
      </aside>
    </section>
  );
}
