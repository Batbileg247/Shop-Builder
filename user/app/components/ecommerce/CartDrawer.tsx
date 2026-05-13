"use client";

import Image from "next/image";
import type { CartItem, Product } from "@/types";
import { safeImage } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/ui/sheet";
import { Button } from "@/ui/button";
import { formatStorefrontPrice } from "@/app/components/ecommerce/storefront-price";

const FREE_SHIP_AT = 200_000;

export function CartDrawer({
  open,
  onOpenChange,
  items,
  onRemoveLine,
  onIncrement,
  onDecrement,
  giftWrap,
  onGiftWrapChange,
  subtotal,
  onCheckout,
  onViewFullCart,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CartItem[];
  onRemoveLine: (id: string) => void;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  giftWrap: boolean;
  onGiftWrapChange: (v: boolean) => void;
  subtotal: number;
  onCheckout: () => void;
  onViewFullCart: () => void;
}) {
  const giftFee = giftWrap ? 10_000 : 0;
  const displaySubtotal = subtotal + giftFee;
  const remaining = Math.max(0, FREE_SHIP_AT - displaySubtotal);

  return (
    <Sheet onOpenChange={onOpenChange} open={open}>
      <SheetContent
        className="flex w-full !max-w-md flex-col border-l border-zinc-200 bg-white p-0 sm:!max-w-md"
        showCloseButton
        side="right"
      >
        <SheetHeader className="border-b border-zinc-100 px-6 pb-4 pt-2">
          <SheetTitle className="font-serif text-2xl font-semibold text-zinc-900">
            Shopping Cart
          </SheetTitle>
          <p className="text-sm text-zinc-600">
            Buy{" "}
            <strong className="text-zinc-900">
              {formatStorefrontPrice(remaining)}
            </strong>{" "}
            more and get <strong>Free Shipping</strong>
          </p>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
          <ul className="flex flex-col gap-5">
            {items.length === 0 ? (
              <li className="rounded-lg border border-dashed border-zinc-200 p-6 text-center text-sm text-zinc-500">
                Your cart is empty.
              </li>
            ) : (
              items.map(({ product, quantity }) => {
                const unit = product.salePrice ?? product.price;
                return (
                  <li className="flex gap-3 border-b border-zinc-100 pb-5" key={product.id}>
                    <div className="relative size-20 shrink-0 overflow-hidden rounded-md bg-zinc-100">
                      <Image
                        alt={product.name}
                        className="object-cover"
                        fill
                        sizes="80px"
                        src={safeImage(product.image)}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-zinc-900">{product.name}</p>
                      <p className="mt-0.5 text-xs text-zinc-500">
                        Color: Classic
                      </p>
                      <p className="mt-1 text-sm font-semibold">
                        {formatStorefrontPrice(unit)}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex items-center rounded border border-zinc-300 text-sm">
                          <button
                            className="px-2 py-1 text-zinc-600 hover:bg-zinc-50"
                            onClick={() => onDecrement(product.id)}
                            type="button"
                          >
                            −
                          </button>
                          <span className="min-w-8 text-center font-medium tabular-nums">
                            {String(quantity).padStart(2, "0")}
                          </span>
                          <button
                            className="px-2 py-1 text-zinc-600 hover:bg-zinc-50"
                            onClick={() => onIncrement(product.id)}
                            type="button"
                          >
                            +
                          </button>
                        </div>
                        <button
                          className="text-xs text-red-600 underline"
                          onClick={() => onRemoveLine(product.id)}
                          type="button"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })
            )}
          </ul>

          <label className="mt-6 flex cursor-pointer items-start gap-2 text-sm text-zinc-700">
            <input
              checked={giftWrap}
              className="mt-1"
              onChange={(e) => onGiftWrapChange(e.target.checked)}
              type="checkbox"
            />
            <span>
              For <strong>{formatStorefrontPrice(1000)}</strong> please wrap the
              product
            </span>
          </label>
        </div>

        <SheetFooter className="border-t border-zinc-100 bg-zinc-50/80 px-6 py-4">
          <div className="flex w-full items-center justify-between text-sm">
            <span className="text-zinc-600">Subtotal</span>
            <span className="text-lg font-semibold text-zinc-900">
              {formatStorefrontPrice(displaySubtotal)}
            </span>
          </div>
          <Button
            className="h-11 w-full bg-black text-white hover:bg-zinc-900"
            disabled={items.length === 0}
            onClick={() => {
              onOpenChange(false);
              onCheckout();
            }}
          >
            Checkout
          </Button>
          <button
            className="w-full text-center text-sm text-zinc-600 underline"
            onClick={() => {
              onOpenChange(false);
              onViewFullCart();
            }}
            type="button"
          >
            View Cart
          </button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
