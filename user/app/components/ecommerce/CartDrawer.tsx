"use client";

import Image from "next/image";
import * as React from "react";
import { usePathname } from "next/navigation";
import type { CartItem } from "@/types";
import { cn, safeImage } from "@/lib/utils";
import { useThemeStore } from "@/stores/useThemeStore";
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

  const pathname = usePathname();
  const preset = useThemeStore((s) => s.preset);
  const radius = useThemeStore((s) => s.radius);
  const cardContentPaddingRem = useThemeStore((s) => s.cardContentPaddingRem);
  const productGridGapRem = useThemeStore((s) => s.productGridGapRem);
  const previewProductCardBasisRem = useThemeStore(
    (s) => s.previewProductCardBasisRem,
  );
  const primaryColor = useThemeStore((s) => s.primaryColor);

  const isPublicStorefront = pathname.startsWith("/s/");
  const portalPvStyle = React.useMemo(
    () =>
      isPublicStorefront
        ? ({
            "--pv-card-content-pad": `${cardContentPaddingRem}rem`,
            "--pv-product-gap": `${productGridGapRem}rem`,
            "--pv-preview-card-basis": `${previewProductCardBasisRem}rem`,
            "--pv-radius": `${radius}px`,
            "--pv-primary": primaryColor,
          } as React.CSSProperties)
        : undefined,
    [
      isPublicStorefront,
      cardContentPaddingRem,
      productGridGapRem,
      previewProductCardBasisRem,
      radius,
      primaryColor,
    ],
  );

  return (
    <Sheet onOpenChange={onOpenChange} open={open}>
      <SheetContent
        className={cn(
          "flex w-full max-w-md! flex-col border-l border-pv-divider bg-pv-bg p-0 sm:max-w-md!",
          isPublicStorefront &&
            "site-preview-root text-pv-fg shadow-lg !gap-0 !bg-pv-bg",
        )}
        data-theme={isPublicStorefront ? preset : undefined}
        showCloseButton
        side="right"
        style={portalPvStyle}
      >
        <SheetHeader className="border-b border-pv-divider px-6 pt-10">
          <SheetTitle className="text-2xl font-semibold text-pv-fg">
            Shopping Cart
          </SheetTitle>
          <p className="text-sm text-pv-muted">
            Buy{" "}
            <strong className="text-pv-fg">
              {formatStorefrontPrice(remaining)}
            </strong>{" "}
            more and get <strong>Free Shipping.</strong>
          </p>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
          <ul className="flex flex-col gap-5">
            {items.length === 0 ? (
              <li className="rounded-(--pv-radius) border border-dashed border-pv-border bg-pv-card p-6 text-center text-sm text-pv-muted">
                Your cart is empty.
              </li>
            ) : (
              items.map(({ product, quantity }) => {
                const unit = product.salePrice ?? product.price;
                return (
                  <li
                    className="flex gap-3 border-b border-pv-divider pb-5"
                    key={product.id}
                  >
                    <div className="relative size-20 shrink-0 overflow-hidden rounded-(--pv-radius) bg-pv-placeholder">
                      <Image
                        alt={product.name}
                        className="object-cover"
                        fill
                        sizes="80px"
                        src={safeImage(product.image)}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-pv-fg">{product.name}</p>
                      <p className="mt-0.5 text-xs text-pv-muted">
                        Color: Classic
                      </p>
                      <p className="mt-1 text-sm font-semibold text-pv-fg">
                        {formatStorefrontPrice(unit)}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex items-center rounded-(--pv-radius) border border-pv-border bg-pv-card text-sm">
                          <button
                            className="px-2 py-1 text-pv-muted hover:bg-pv-empty"
                            onClick={() => onDecrement(product.id)}
                            type="button"
                          >
                            −
                          </button>
                          <span className="min-w-8 text-center font-medium tabular-nums text-pv-fg">
                            {String(quantity).padStart(2, "0")}
                          </span>
                          <button
                            className="px-2 py-1 text-pv-muted hover:bg-pv-empty"
                            onClick={() => onIncrement(product.id)}
                            type="button"
                          >
                            +
                          </button>
                        </div>
                        <button
                          className="text-xs text-red-600 underline decoration-red-400/60 underline-offset-2"
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
        </div>

        <SheetFooter className="border-t border-pv-divider bg-pv-card px-6 py-6 pb-7">
          <div className="flex w-full items-center justify-between text-sm">
            <span className="text-pv-fg">Subtotal</span>
            <span className="text-lg font-semibold text-pv-fg">
              {formatStorefrontPrice(displaySubtotal)}
            </span>
          </div>
          <Button
            className="pv-btn-primary h-11 w-full "
            disabled={items.length === 0}
            onClick={() => {
              onOpenChange(false);
              onCheckout();
            }}
          >
            Checkout
          </Button>
          <button
            className="w-full text-center text-sm text-pv-fg underline decoration-pv-divider underline-offset-2 hover:text-pv-fg"
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
