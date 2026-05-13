"use client";

import Image from "next/image";
import type { CartItem } from "@/types";
import { safeImage } from "@/lib/utils";
import { Field } from "@/ui";
import { Button } from "@/ui/button";
import { formatStorefrontPrice } from "@/app/components/ecommerce/storefront-price";

export function CheckoutSummary({
  items,
  giftWrap,
  onGiftWrapChange,
  buyerName,
  setBuyerName,
  buyerEmail,
  setBuyerEmail,
  subtotal,
  onCheckout,
  onContinueShopping,
  onViewCart,
  lastOrderId,
  onRemoveLine,
}: {
  items: CartItem[];
  giftWrap: boolean;
  onGiftWrapChange: (v: boolean) => void;
  buyerName: string;
  setBuyerName: (v: string) => void;
  buyerEmail: string;
  setBuyerEmail: (v: string) => void;
  subtotal: number;
  onCheckout: () => void;
  onContinueShopping: () => void;
  onViewCart: () => void;
  lastOrderId: string;
  onRemoveLine: (id: string) => void;
}) {
  const giftFee = giftWrap ? 10_000 : 0;
  const total = subtotal + giftFee;

  if (lastOrderId) {
    return (
      <div className="mx-auto max-w-2xl rounded-xl border border-emerald-200 bg-emerald-50/60 p-8 text-center">
        <p className="font-serif text-2xl font-semibold text-emerald-900">
          Thank you!
        </p>
        <p className="mt-2 text-sm text-emerald-800">
          Order <strong>{lastOrderId}</strong> has been placed.
        </p>
        <Button className="mt-6" onClick={onContinueShopping} variant="outline">
          Continue shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <header className="mb-10 text-center">
        <h1 className="font-serif text-3xl font-semibold text-zinc-900 sm:text-4xl">
          Shopping Cart
        </h1>
        <p className="mt-2 text-sm text-zinc-500">Home › Your Shopping Cart</p>
      </header>

      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50/80 text-zinc-600">
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="hidden px-4 py-3 font-medium sm:table-cell">Price</th>
              <th className="px-4 py-3 font-medium">Quantity</th>
              <th className="hidden px-4 py-3 text-right font-medium sm:table-cell">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td className="px-4 py-10 text-center text-zinc-500" colSpan={4}>
                  No items in your cart yet.
                </td>
              </tr>
            ) : (
              items.map(({ product, quantity }) => {
                const unit = product.salePrice ?? product.price;
                const line = unit * quantity;
                return (
                  <tr className="border-b border-zinc-100" key={product.id}>
                    <td className="px-4 py-4">
                      <div className="flex gap-3">
                        <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-zinc-100">
                          <Image
                            alt={product.name}
                            className="object-cover"
                            fill
                            sizes="64px"
                            src={safeImage(product.image)}
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-zinc-900">
                            {product.name}
                          </p>
                          <p className="text-xs text-zinc-500">Color: Classic</p>
                          <button
                            className="mt-1 text-xs text-red-600 underline"
                            onClick={() => onRemoveLine(product.id)}
                            type="button"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-4 py-4 sm:table-cell">
                      {formatStorefrontPrice(unit)}
                    </td>
                    <td className="px-4 py-4 align-top">
                      <span className="inline-flex items-center rounded border border-zinc-300 px-2 py-1 font-medium tabular-nums">
                        {String(quantity).padStart(2, "0")}
                      </span>
                    </td>
                    <td className="hidden px-4 py-4 text-right font-semibold sm:table-cell">
                      {formatStorefrontPrice(line)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:justify-end">
        <div className="w-full max-w-md space-y-4 lg:ml-auto">
          <label className="flex cursor-pointer items-start gap-2 text-sm text-zinc-700">
            <input
              checked={giftWrap}
              className="mt-1"
              onChange={(e) => onGiftWrapChange(e.target.checked)}
              type="checkbox"
            />
            <span>
              For <strong>{formatStorefrontPrice(10_000)}</strong> please wrap the
              product
            </span>
          </label>

          <div className="flex items-center justify-between border-t border-zinc-200 pt-4 text-sm">
            <span className="text-zinc-600">Subtotal</span>
            <span className="text-lg font-semibold">
              {formatStorefrontPrice(total)}
            </span>
          </div>

          <div className="grid gap-3">
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
          </div>

          <Button
            className="h-11 w-full bg-black text-white hover:bg-zinc-900"
            disabled={items.length === 0 || !buyerName.trim()}
            onClick={onCheckout}
          >
            Checkout
          </Button>
          <button
            className="w-full text-center text-sm text-zinc-600 underline"
            onClick={onViewCart}
            type="button"
          >
            View Cart
          </button>
        </div>
      </div>

      <section className="mt-16 border-t border-zinc-200 pt-16">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div className="grid grid-cols-2 gap-3">
            <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-zinc-100">
              <Image
                alt=""
                className="object-cover"
                fill
                sizes="(max-width:768px) 40vw, 200px"
                src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80"
              />
            </div>
            <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-zinc-100">
              <Image
                alt=""
                className="object-cover"
                fill
                sizes="(max-width:768px) 40vw, 200px"
                src="https://images.unsplash.com/photo-1539109136881-3be0616acf5b?auto=format&fit=crop&w=600&q=80"
              />
            </div>
          </div>
          <div className="text-center md:text-left">
            <h2 className="font-serif text-2xl font-semibold text-zinc-900">
              Subscribe To Our Newsletter
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scelerisque
              duis ultricies sollicitudin aliquam.
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <input
                className="input flex-1"
                placeholder="michael@ymail.com"
                type="email"
              />
              <Button className="shrink-0 bg-black text-white hover:bg-zinc-900">
                Subscribe Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="mt-16 border-t border-zinc-200 py-8 text-center text-xs text-zinc-500">
        <p className="font-serif text-lg font-semibold text-zinc-900">
          Storefront
        </p>
        <p className="mt-2">Copyright © {new Date().getFullYear()}. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
