"use client";

import Link from "next/link";
import { useShop } from "@/app/hooks/useShop";
import { EcommerceStorefront } from "@/app/components/ecommerce";

/** Full `useShop` storefront + filters — keeper `/builder/shop` behavior lives here. */
export default function BuilderCatalogPage() {
  const shop = useShop();

  return (
    <section className="flex min-h-0 w-full flex-col pb-10">
      <Link
        className="mb-6 inline-flex w-fit text-sm font-medium text-zinc-600 underline-offset-4 transition hover:text-zinc-900 hover:underline"
        href="/builder"
      >
        ← Back to builder home
      </Link>
      <EcommerceStorefront
        addQuantityToCart={shop.addQuantityToCart}
        addToCart={shop.addToCart}
        allProductsHref="/builder/catalog"
        buyerEmail={shop.buyerEmail}
        buyerName={shop.buyerName}
        cartItems={shop.cartItems}
        cartTotal={shop.cartTotal}
        catalogFilters={shop.catalogFilterDefinitions}
        catalogLayout="full"
        checkout={shop.checkout}
        clearCartItem={shop.clearCartItem}
        clearLastOrder={shop.clearLastOrder}
        lastOrderId={shop.lastOrderId}
        products={shop.products}
        removeFromCart={shop.removeFromCart}
        setBuyerEmail={shop.setBuyerEmail}
        setBuyerName={shop.setBuyerName}
        theme={shop.theme}
      />
    </section>
  );
}
