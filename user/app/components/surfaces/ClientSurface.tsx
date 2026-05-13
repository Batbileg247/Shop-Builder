"use client";

import type { Dispatch, SetStateAction } from "react";
import type { CartItem, CatalogFilterDefinition, Product, ShopTheme } from "@/types";
import { EcommerceStorefront } from "@/app/components/ecommerce";
import { SHOP_PREVIEW_HOST_CLASS } from "@/app/components/shop";

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
  catalogFilters: CatalogFilterDefinition[];
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
  catalogFilters,
  setBuyerEmail,
  setBuyerName,
  theme,
}: Props) {
  return (
    <section className="flex min-h-0 w-full flex-1 flex-col">
      <div
        className={`${SHOP_PREVIEW_HOST_CLASS} min-h-0 w-full max-w-full lg:sticky lg:top-4 lg:z-10 lg:self-start`}
      >
        <EcommerceStorefront
          addQuantityToCart={addQuantityToCart}
          addToCart={addToCart}
          buyerEmail={buyerEmail}
          buyerName={buyerName}
          cartItems={cartItems}
          cartTotal={cartTotal}
          catalogFilters={catalogFilters}
          checkout={checkout}
          clearCartItem={clearCartItem}
          clearLastOrder={clearLastOrder}
          lastOrderId={lastOrderId}
          products={products}
          removeFromCart={removeFromCart}
          resizableHero={false}
          setBuyerEmail={setBuyerEmail}
          setBuyerName={setBuyerName}
          theme={theme}
        />
      </div>
    </section>
  );
}
