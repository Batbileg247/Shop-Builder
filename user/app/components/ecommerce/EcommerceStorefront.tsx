"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type {
  CartItem,
  CatalogFilterDefinition,
  Product,
  ShopTheme,
} from "@/types";
import type { Dispatch, SetStateAction } from "react";
import {
  HeroShelfResizable,
  SHOP_PREVIEW_HOST_CLASS,
  ShopHero,
} from "@/app/components/shop";
import { ProductGrid } from "@/app/components/ecommerce/ProductGrid";
import { ProductDetail } from "@/app/components/ecommerce/ProductDetail";
import { CartDrawer } from "@/app/components/ecommerce/CartDrawer";
import { CheckoutSummary } from "@/app/components/ecommerce/CheckoutSummary";
import { StorefrontHeader } from "@/app/components/ecommerce/StorefrontHeader";
import { FilterSidebar } from "@/app/components/ecommerce/FilterSidebar";
import { Button } from "@/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/ui/sheet";
import {
  applyCatalogFilters,
  buildDefaultSelections,
  filterDefinitionsSignature,
  type CatalogFilterSelections,
  type PriceSortMode,
} from "@/lib/catalog-filters";
import {
  buildHeroCarouselUrls,
  shopPreviewShellStyle,
} from "@/lib/shop-theme";

const INITIAL_GRID = 6;

function effectivePrice(p: Product) {
  return p.salePrice ?? p.price;
}

type Phase = "browse" | "checkout";

/** `preview` = first 6 + View More navigates to `allProductsHref`. `full` = all products on this view. */
export type StorefrontCatalogLayout = "preview" | "full";

type Props = {
  theme: ShopTheme;
  products: Product[];
  catalogFilters: CatalogFilterDefinition[];
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
  /** Client storefront: fixed hero height, no drag handle. Builder/catalog: resizable split. */
  resizableHero?: boolean;
  catalogLayout?: StorefrontCatalogLayout;
  /** Client navigates here when View More is clicked (preview mode). */
  allProductsHref?: string;
};

export function EcommerceStorefront({
  theme,
  products,
  catalogFilters,
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
  allProductsHref = "/builder/catalog",
  resizableHero = true,
}: Props) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("browse");
  const defSig = useMemo(
    () => filterDefinitionsSignature(catalogFilters),
    [catalogFilters],
  );
  const [filterSelections, setFilterSelections] = useState<CatalogFilterSelections>(
    () => buildDefaultSelections(catalogFilters),
  );
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [giftWrap, setGiftWrap] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [priceSort, setPriceSort] = useState<PriceSortMode>("none");

  useEffect(() => {
    setFilterSelections(buildDefaultSelections(catalogFilters));
  }, [defSig, catalogFilters]);

  const brandLabel = theme.name;

  const filtered = useMemo(
    () => applyCatalogFilters(products, catalogFilters, filterSelections),
    [products, catalogFilters, filterSelections],
  );

  const priceSorted = useMemo(() => {
    if (priceSort === "none") return filtered;
    const copy = [...filtered];
    copy.sort((a, b) =>
      priceSort === "asc"
        ? effectivePrice(a) - effectivePrice(b)
        : effectivePrice(b) - effectivePrice(a),
    );
    return copy;
  }, [filtered, priceSort]);

  const cyclePriceSort = () => {
    setPriceSort((s) =>
      s === "none" ? "asc" : s === "asc" ? "desc" : "none",
    );
  };

  const visibleProducts = useMemo(() => {
    if (catalogLayout === "full") return priceSorted;
    return priceSorted.slice(0, INITIAL_GRID);
  }, [catalogLayout, priceSorted]);

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

  const slides = useMemo(() => buildHeroCarouselUrls(theme), [theme]);

  const storefrontBody = (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-white">
      <StorefrontHeader
        brandName={theme.name}
        cartCount={cartCount}
        onOpenCart={() => setCartOpen(true)}
        onOpenMobileFilters={
          catalogLayout === "full"
            ? () => setMobileFiltersOpen(true)
            : undefined
        }
        showMobileFilters={catalogLayout === "full"}
      />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {phase === "checkout" ? (
          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-10 sm:px-8">
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
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">
            {catalogLayout === "full" && (
              <aside className="hidden w-[17.5rem] shrink-0 overflow-y-auto border-r border-zinc-100 bg-zinc-50/90 lg:block">
                <FilterSidebar
                  definitions={catalogFilters}
                  onPriceSortCycle={
                    catalogFilters.some((d) => d.type === "priceRange")
                      ? cyclePriceSort
                      : undefined
                  }
                  onSelectionsChange={setFilterSelections}
                  priceSortMode={priceSort}
                  selections={filterSelections}
                />
              </aside>
            )}

            <main className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-4 py-8 sm:px-8 lg:px-10">
              <div className="mx-auto max-w-7xl">
                <div className="text-center">
                  <h1 className="font-serif text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl md:text-5xl">
                    {catalogLayout === "full" ? "Products" : "New Arrivals"}
                  </h1>
                  <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-zinc-500 sm:text-base">
                    {catalogLayout === "full"
                      ? `${filtered.length} items — adjust filters to narrow results.`
                      : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scelerisque duis ultricies sollicitudin aliquam nulla. Purus sit lectus faucibus."}
                  </p>
                </div>

                <div className="mt-10">
                  <ProductGrid
                    brandLabel={brandLabel}
                    onProductOpen={openProduct}
                    products={visibleProducts}
                    variant={catalogLayout === "full" ? "dense" : "default"}
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
            </main>
          </div>
        )}
      </div>
    </div>
  );

  const heroNode = (
    <ShopHero fillContainer heroImages={slides} theme={theme} />
  );

  return (
    <div className={SHOP_PREVIEW_HOST_CLASS}>
      {resizableHero ? (
        <HeroShelfResizable
          belowHero={storefrontBody}
          hero={heroNode}
          theme={theme}
        />
      ) : (
        <div
          className="flex h-full min-h-0 flex-col overflow-hidden rounded-md border border-black/10 shadow-sm"
          style={shopPreviewShellStyle(theme)}
        >
          <div className="relative h-[min(34vh,320px)] min-h-[180px] w-full shrink-0 overflow-hidden sm:h-[min(38vh,380px)]">
            {heroNode}
          </div>
          {storefrontBody}
        </div>
      )}

      {catalogLayout === "full" && (
        <Sheet onOpenChange={setMobileFiltersOpen} open={mobileFiltersOpen}>
          <SheetContent
            className="flex w-full !max-w-sm flex-col gap-0 p-0 sm:!max-w-sm"
            showCloseButton
            side="left"
          >
            <SheetHeader className="border-b border-zinc-100 px-4 py-3">
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="min-h-0 flex-1 overflow-y-auto">
              <FilterSidebar
                definitions={catalogFilters}
                onPriceSortCycle={
                  catalogFilters.some((d) => d.type === "priceRange")
                    ? cyclePriceSort
                    : undefined
                }
                onSelectionsChange={setFilterSelections}
                priceSortMode={priceSort}
                selections={filterSelections}
              />
            </div>
          </SheetContent>
        </Sheet>
      )}

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
