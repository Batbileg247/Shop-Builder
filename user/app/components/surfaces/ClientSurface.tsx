"use client";

import type { Dispatch, SetStateAction } from "react";
import type { CartItem, Product, ShopTheme } from "@/types";
import { EcommerceStorefront } from "@/app/components/ecommerce";

type Props = {
  addToCart: (id: string) => void;
  addQuantityToCart: (id: string, amount: number) => void;
  removeFromCart: (id: string) => void;
  clearCartItem: (id: string) => void;
  buyerEmail: string;
  buyerName: string;
  cartItems: CartItem[];
  cartTotal: number;
  checkout: () => void;
  clearLastOrder: () => void;
  lastOrderId: string;
  products: Product[];
  setBuyerEmail: Dispatch<SetStateAction<string>>;
  setBuyerName: Dispatch<SetStateAction<string>>;
  theme: ShopTheme;
};

export function ClientSurface({
  addToCart,
  addQuantityToCart,
  removeFromCart,
  clearCartItem,
  buyerEmail,
  buyerName,
  cartItems,
  cartTotal,
  checkout,
  clearLastOrder,
  lastOrderId,
  products,
  setBuyerEmail,
  setBuyerName,
  theme,
}: Props) {
  return (
    <section className="flex min-h-0 w-full flex-col">
      <EcommerceStorefront
        addQuantityToCart={addQuantityToCart}
        addToCart={addToCart}
        buyerEmail={buyerEmail}
        buyerName={buyerName}
        cartItems={cartItems}
        cartTotal={cartTotal}
        checkout={checkout}
        clearCartItem={clearCartItem}
        clearLastOrder={clearLastOrder}
        lastOrderId={lastOrderId}
        products={products}
        removeFromCart={removeFromCart}
        setBuyerEmail={setBuyerEmail}
        setBuyerName={setBuyerName}
        theme={theme}
      />
    </section>
  );
}
