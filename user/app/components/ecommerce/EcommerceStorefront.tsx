"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { CartItem, Product, ShopTheme } from "@/types";
import type { Dispatch, SetStateAction } from "react";
import { SHOP_PREVIEW_HOST_CLASS } from "@/app/components/shop";
import { ProductGrid } from "@/app/components/ecommerce/ProductGrid";
import { ProductDetail } from "@/app/components/ecommerce/ProductDetail";
import { CartDrawer } from "@/app/components/ecommerce/CartDrawer";
import { CheckoutSummary } from "@/app/components/ecommerce/CheckoutSummary";
import { StorefrontHeader } from "@/app/components/ecommerce/StorefrontHeader";
import { Button } from "@/ui/button";

const INITIAL_GRID = 6;

const FILTER_CHIPS = [
  "All",
  "Men's Fashion",
  "Women's Fashion",
  "Women Accessories",
  "Accessories",
  "Discount Deals",
] as const;

type Phase = "browse" | "checkout";

/** `preview` = first 6 + View More navigates to `allProductsHref`. `full` = all products on this view. */
export type StorefrontCatalogLayout = "preview" | "full";

type Props = {
  theme: ShopTheme;
  products: Product[];
  cartItems: CartItem[];
  cartTotal: number;
  addToCart: (id: string) => void;
  addQuantityToCart: (id: string, amount: number) => void;
  removeFromCart: (id: string) => void;
  clearCartItem: (id: string) => void;
  buyerName: string;
  setBuyerName: Dispatch<SetStateAction<string>>;
  buyerEmail: string;
  setBuyerEmail: Dispatch<SetStateAction<string>>;
  checkout: () => void;
  clearLastOrder: () => void;
  lastOrderId: string;
  catalogLayout?: StorefrontCatalogLayout;
  /** Client navigates here when View More is clicked (preview mode). */
  allProductsHref?: string;
};

export function EcommerceStorefront({
  theme,
  products,
  cartItems,
  cartTotal,
  addToCart,
  addQuantityToCart,
  removeFromCart,
  clearCartItem,
  buyerName,
  setBuyerName,
  buyerEmail,
  setBuyerEmail,
  checkout,
  clearLastOrder,
  lastOrderId,
  catalogLayout = "preview",
  allProductsHref = "/builder/shop",
}: Props) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("browse");
  const [category, setCategory] =
    useState<(typeof FILTER_CHIPS)[number]>("All");
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [giftWrap, setGiftWrap] = useState(false);

  const brandLabel = theme.name;

  const filtered = useMemo(() => {
    if (category === "All") return products;
    if (category === "Discount Deals")
      return products.filter((p) => p.salePrice != null);
    if (category === "Accessories")
      return products.filter((p) => p.category === "Accessories");
    return products.filter((p) => p.category === category);
  }, [products, category]);

  const visibleProducts = useMemo(() => {
    if (catalogLayout === "full") return filtered;
    return filtered.slice(0, INITIAL_GRID);
  }, [catalogLayout, filtered]);

  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  const openProduct = (p: Product) => {
    setDetailProduct(p);
    setDetailOpen(true);
  };

  const closeDetail = () => {
    setDetailOpen(false);
  };

  const handleAddFromDetail = (product: Product, quantity: number) => {
    addQuantityToCart(product.id, quantity);
    setDetailOpen(false);
    setCartOpen(true);
  };

  const goCheckout = () => {
    setPhase("checkout");
  };

  const goBrowse = () => {
    setPhase("browse");
  };

  return (
    <div className={SHOP_PREVIEW_HOST_CLASS}>
      <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-md border border-black/10 bg-white shadow-sm">
        <StorefrontHeader
          brandName={theme.name}
          cartCount={cartCount}
          onOpenCart={() => setCartOpen(true)}
        />

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain">
          {phase === "checkout" ? (
            <div className="px-4 py-10 sm:px-8">
              <CheckoutSummary
                buyerEmail={buyerEmail}
                buyerName={buyerName}
                giftWrap={giftWrap}
                items={cartItems}
                lastOrderId={lastOrderId}
                onCheckout={checkout}
                onContinueShopping={() => {
                  clearLastOrder();
                  goBrowse();
                }}
                onGiftWrapChange={setGiftWrap}
                onRemoveLine={clearCartItem}
                onViewCart={() => {
                  goBrowse();
                  setCartOpen(true);
                }}
                setBuyerEmail={setBuyerEmail}
                setBuyerName={setBuyerName}
                subtotal={cartTotal}
              />
            </div>
          ) : (
            <div className="px-4 py-10 sm:px-8 lg:px-12">
              <div className="mx-auto max-w-6xl">
                <div className="text-center">
                  <h1 className="font-serif text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl md:text-5xl">
                    {catalogLayout === "full" ? "All products" : "New Arrivals"}
                  </h1>
                  <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-zinc-500 sm:text-base">
                    {catalogLayout === "full"
                      ? "Browse the full catalog with the same filters as in the builder preview."
                      : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scelerisque duis ultricies sollicitudin aliquam nulla. Purus sit lectus faucibus."}
                  </p>
                </div>

                <div className="mt-8 flex flex-wrap justify-center gap-2 sm:gap-3">
                  {FILTER_CHIPS.map((cat) => {
                    const active = category === cat;
                    return (
                      <button
                        className={
                          active
                            ? "rounded-full bg-black px-4 py-2 text-sm font-semibold text-white transition"
                            : "rounded-full bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-600 transition hover:bg-zinc-200"
                        }
                        key={cat}
                        onClick={() => setCategory(cat)}
                        type="button"
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-10">
                  <ProductGrid
                    brandLabel={brandLabel}
                    onProductOpen={openProduct}
                    products={visibleProducts}
                  />
                </div>

                {catalogLayout === "preview" &&
                  filtered.length > INITIAL_GRID && (
                    <div className="mt-10 flex justify-center">
                      <Button
                        className="min-w-[200px] bg-black px-10 py-6 text-base font-semibold text-white hover:bg-zinc-900"
                        onClick={() => router.push(allProductsHref)}
                        type="button"
                      >
                        View More
                      </Button>
                    </div>
                  )}
              </div>
            </div>
          )}
        </div>
      </div>

      <ProductDetail
        brandLabel={brandLabel}
        onAddToCart={handleAddFromDetail}
        onClose={closeDetail}
        open={detailOpen && detailProduct != null}
        product={detailProduct}
      />

      <CartDrawer
        giftWrap={giftWrap}
        items={cartItems}
        onCheckout={goCheckout}
        onDecrement={removeFromCart}
        onGiftWrapChange={setGiftWrap}
        onIncrement={addToCart}
        onOpenChange={setCartOpen}
        onRemoveLine={clearCartItem}
        onViewFullCart={() => {
          setCartOpen(false);
          goCheckout();
        }}
        open={cartOpen}
        subtotal={cartTotal}
      />
    </div>
  );
}
