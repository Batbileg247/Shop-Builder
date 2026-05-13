"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useShop } from "@/app/hooks/useShop";
import { useThemeStore } from "@/stores/useThemeStore";
import { ShopHero } from "@/app/components/shop";
import { buildHeroCarouselUrls, shopPreviewShellStyle } from "@/lib/shop-theme";
import {
  HeroShelfResizable,
  SHOP_PREVIEW_HOST_CLASS,
  SHOP_PREVIEW_HOST_DEMO_CLASS,
} from "@/app/components/shop/HeroShelfResizable";
import { ProductCard } from "@/app/components/ecommerce/ProductCard";
import { ProductGrid } from "@/app/components/ecommerce/ProductGrid";
import { FilterSidebar } from "@/app/components/ecommerce/FilterSidebar";
import { Button } from "@/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/ui/sheet";
import {
  applyCatalogFilters,
  buildDefaultSelections,
  filterDefinitionsSignature,
  type CatalogFilterSelections,
  type PriceSortMode,
} from "@/lib/catalog-filters";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

import { ShopProductDetailModal } from "./shop-product-detail-modal";
import { SiteHeader } from "./site-header";
import { useBuilderUi } from "@/context/builder-ui-context";
import { storefrontNavBase } from "@/lib/site-paths";
import { CartDrawer } from "@/app/components/ecommerce/CartDrawer";

const PREVIEW_PAGE_SIZE = 6;

function effectivePrice(p: Product) {
  return p.salePrice ?? p.price;
}

function mergeSearchParams(
  pathname: string,
  current: URLSearchParams,
  updates: Record<string, string | null | undefined>,
) {
  const next = new URLSearchParams(current.toString());
  for (const [k, v] of Object.entries(updates)) {
    if (v == null || v === "") next.delete(k);
    else next.set(k, v);
  }
  const qs = next.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

function HomePageInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const navBase = storefrontNavBase(pathname);

  const preset = useThemeStore((s) => s.preset);
  const heroTitle = useThemeStore((s) => s.heroTitle);
  const heroImage = useThemeStore((s) => s.heroImage);
  const shopName = useThemeStore((s) => s.shopName);
  const heroAnnouncement = useThemeStore((s) => s.heroAnnouncement);
  const primaryColor = useThemeStore((s) => s.primaryColor);
  const backgroundColor = useThemeStore((s) => s.backgroundColor);
  const textColor = useThemeStore((s) => s.textColor);
  const font = useThemeStore((s) => s.font);
  const radius = useThemeStore((s) => s.radius);
  const shop = useShop();
  const { isDemo, heroPanelPercent, setHeroPanelPercent } = useBuilderUi();

  /** Жинхэнэ storefront (`/s/...`) — builder preview-ийн хүрээгүй, View Demo-тэй ижил бүтэн site. */
  const isStorefront = pathname.startsWith("/s/");
  const fullSiteShell = isDemo || isStorefront;

  const catalogFull = searchParams.get("view") === "all";
  const previewHostClass = fullSiteShell
    ? SHOP_PREVIEW_HOST_DEMO_CLASS
    : SHOP_PREVIEW_HOST_CLASS;

  const [detailProduct, setDetailProduct] = React.useState<
    (typeof shop.products)[number] | null
  >(null);
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [cartOpen, setCartOpen] = React.useState(false);
  const [giftWrap, setGiftWrap] = React.useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = React.useState(false);
  const [previewCategory, setPreviewCategory] = React.useState<string>("All");
  const [priceSort, setPriceSort] = React.useState<PriceSortMode>("none");

  const defSig = React.useMemo(
    () => filterDefinitionsSignature(shop.catalogFilterDefinitions),
    [shop.catalogFilterDefinitions],
  );

  const [filterSelections, setFilterSelections] =
    React.useState<CatalogFilterSelections>(() =>
      buildDefaultSelections(shop.catalogFilterDefinitions),
    );

  React.useEffect(() => {
    setFilterSelections(buildDefaultSelections(shop.catalogFilterDefinitions));
  }, [defSig, shop.catalogFilterDefinitions]);

  React.useEffect(() => {
    const intent = searchParams.get("cart") === "open";
    setCartOpen(intent);
  }, [searchParams]);

  const openDetail = (p: (typeof shop.products)[number]) => {
    setDetailProduct(p);
    setDetailOpen(true);
  };

  const effectiveTheme = React.useMemo(
    () => ({
      ...shop.theme,
      name: shopName,
      announcement: heroAnnouncement,
      heroImage,
      tagline: heroTitle,
      primaryColor,
      backgroundColor,
      textColor,
      font,
      radius,
    }),
    [
      shop.theme,
      shopName,
      heroAnnouncement,
      heroImage,
      heroTitle,
      primaryColor,
      backgroundColor,
      textColor,
      font,
      radius,
    ],
  );

  const brandLabel = shopName;

  const categoryChips = React.useMemo(() => {
    const set = new Set(shop.products.map((p) => p.category));
    return ["All", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [shop.products]);

  const previewPool = React.useMemo(() => {
    if (previewCategory === "All") return shop.products;
    return shop.products.filter((p) => p.category === previewCategory);
  }, [shop.products, previewCategory]);

  const previewProducts = React.useMemo(
    () => previewPool.slice(0, PREVIEW_PAGE_SIZE),
    [previewPool],
  );

  const showViewMore =
    previewPool.length > PREVIEW_PAGE_SIZE ||
    shop.products.length > PREVIEW_PAGE_SIZE;

  const filteredCatalog = React.useMemo(
    () =>
      applyCatalogFilters(
        shop.products,
        shop.catalogFilterDefinitions,
        filterSelections,
      ),
    [shop.products, shop.catalogFilterDefinitions, filterSelections],
  );

  const catalogSorted = React.useMemo(() => {
    if (priceSort === "none") return filteredCatalog;
    const copy = [...filteredCatalog];
    copy.sort((a, b) =>
      priceSort === "asc"
        ? effectivePrice(a) - effectivePrice(b)
        : effectivePrice(b) - effectivePrice(a),
    );
    return copy;
  }, [filteredCatalog, priceSort]);

  const cyclePriceSort = () => {
    setPriceSort((s) => (s === "none" ? "asc" : s === "asc" ? "desc" : "none"));
  };

  const filterSidebarProps = {
    definitions: shop.catalogFilterDefinitions,
    selections: filterSelections,
    onSelectionsChange: setFilterSelections,
    priceSortMode: priceSort,
    onPriceSortCycle: shop.catalogFilterDefinitions.some(
      (d) => d.type === "priceRange",
    )
      ? cyclePriceSort
      : undefined,
  };

  const goFullCatalog = () => {
    router.replace(mergeSearchParams(pathname, searchParams, { view: "all" }));
  };

  const goPreviewCatalog = () => {
    router.replace(mergeSearchParams(pathname, searchParams, { view: null }));
  };

  const fullShopLayout = (
    <div
      className={cn(
        "flex flex-col border-t border-pv-divider bg-pv-bg",
        fullSiteShell ? "w-full lg:flex-row lg:items-start" : "flex-1 lg:flex-row",
        !fullSiteShell && "h-full min-h-0 overflow-hidden",
      )}
    >
      <aside
        className={cn(
          "shrink-0 border-pv-divider bg-pv-header",
          fullSiteShell
            ? "w-full border-b px-4 py-6 lg:w-[17.5rem] lg:border-r lg:border-b-0 lg:shrink-0 sm:px-6"
            : "hidden w-[17.5rem] overflow-y-auto border-r lg:block",
        )}
      >
        <FilterSidebar {...filterSidebarProps} />
      </aside>

      <main
        className={cn(
          "px-4 py-8 sm:px-8 lg:px-10",
          fullSiteShell
            ? "w-full min-w-0 flex-1"
            : "min-h-0 flex-1 overflow-y-auto overscroll-y-contain",
        )}
      >
        <div className="mb-6 flex flex-col gap-3 border-b border-pv-divider pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs text-pv-muted">
              <span className="text-pv-fg">Home</span>
              <span className="mx-1.5 text-pv-muted">/</span>
              <span>Shop</span>
            </p>
            <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-pv-fg sm:text-4xl">
              Fashion
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-pv-muted">
              {filteredCatalog.length} items — use filters to narrow results.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button
              className="lg:hidden"
              onClick={() => setMobileFiltersOpen(true)}
              type="button"
              variant="outline"
            >
              Filters
            </Button>
            <Button
              className={cn(preset === "neumorph" ? "text-black" : "")}
              onClick={goPreviewCatalog}
              type="button"
              variant="outline"
            >
              ← New Arrivals
            </Button>
          </div>
        </div>

        <ProductGrid
          brandLabel={brandLabel}
          onProductOpen={openDetail}
          products={catalogSorted}
          variant="dense"
        />
      </main>

      <Sheet onOpenChange={setMobileFiltersOpen} open={mobileFiltersOpen}>
        <SheetContent
          className="flex w-full max-w-sm! flex-col gap-0 p-0 sm:max-w-sm!"
          showCloseButton
          side="left"
        >
          <SheetHeader className="border-b border-pv-divider px-4 py-3">
            <SheetTitle className="text-pv-fg">Filters</SheetTitle>
          </SheetHeader>
          <div className="min-h-0 flex-1 overflow-y-auto">
            <FilterSidebar {...filterSidebarProps} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );

  const previewBelowHero = (
    <div
      className={cn(
        "border-t border-pv-divider bg-pv-bg",
        fullSiteShell ? "w-full" : "min-h-0 flex-1 overflow-y-auto",
      )}
    >
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {categoryChips.map((cat) => (
            <button
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition",
                previewCategory === cat
                  ? "bg-pv-primary text-pv-primary-fg shadow-pv-primary"
                  : "bg-pv-card text-pv-fg ring-1 ring-pv-border hover:bg-pv-empty",
              )}
              key={cat}
              onClick={() => setPreviewCategory(cat)}
              type="button"
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-(--pv-product-gap,1.5rem) sm:grid-cols-2 lg:grid-cols-3">
          {previewProducts.map((p) => (
            <ProductCard
              brandLabel={p.category}
              key={p.id}
              onOpen={() => openDetail(p)}
              product={p}
            />
          ))}
        </div>

        {showViewMore ? (
          <div className="mt-10 flex justify-center">
            <Button
              className="pv-btn-primary min-w-[200px] px-10 py-6 text-base font-semibold"
              onClick={goFullCatalog}
              type="button"
            >
              View More
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );

  return (
    <div
      className={cn(
        "pv-storefront flex w-full flex-col",
        fullSiteShell
          ? isStorefront
            ? "min-h-svh w-full"
            : "w-full pt-16"
          : "min-h-svh",
      )}
      data-theme={preset}
    >
      {!isDemo || isStorefront ? <SiteHeader /> : null}

      <section
        className={cn(
          "flex w-full flex-col",
          fullSiteShell ? "w-full" : "min-h-0 flex-1 overflow-y-auto px-6 py-8",
        )}
      >
        {catalogFull ? (
          <div className={previewHostClass}>
            <div
              className={cn(
                "flex w-full max-w-full flex-col rounded-md border border-black/10 shadow-sm",
                !fullSiteShell && "h-full min-h-0 overflow-hidden",
              )}
              style={shopPreviewShellStyle(effectiveTheme)}
            >
              {fullShopLayout}
            </div>
          </div>
        ) : (
          <div className={previewHostClass}>
            <HeroShelfResizable
              belowHero={previewBelowHero}
              hero={
                <ShopHero
                  fillContainer
                  heroImages={buildHeroCarouselUrls(effectiveTheme)}
                  theme={effectiveTheme}
                />
              }
              heroSizePercent={heroPanelPercent}
              locked={fullSiteShell}
              onHeroPercentChange={setHeroPanelPercent}
              theme={effectiveTheme}
            />
          </div>
        )}
      </section>

      <ShopProductDetailModal
        onAddToCart={(product, qty) => {
          shop.addQuantityToCart(product.id, qty);
          setDetailOpen(false);
        }}
        onClose={() => setDetailOpen(false)}
        open={detailOpen}
        product={detailProduct}
      />

      <CartDrawer
        giftWrap={giftWrap}
        items={shop.cartItems}
        onCheckout={() => router.push(`${navBase}/checkout`)}
        onDecrement={shop.removeFromCart}
        onGiftWrapChange={setGiftWrap}
        onIncrement={shop.addToCart}
        onOpenChange={(open) => {
          setCartOpen(open);
          const next = new URLSearchParams(searchParams.toString());
          if (open) next.set("cart", "open");
          else next.delete("cart");
          const qs = next.toString();
          router.replace(qs ? `${pathname}?${qs}` : pathname);
        }}
        onRemoveLine={shop.clearCartItem}
        onViewFullCart={() => router.push(`${navBase}/cart`)}
        open={cartOpen}
        subtotal={shop.cartTotal}
      />

      {!fullSiteShell ? (
        <footer className="mt-auto border-t border-pv-divider py-8 text-center text-xs text-pv-muted">
          © {new Date().getFullYear()} Онлайн худалдааг хөгжүүлэгч{" "}
          <span className="font-bold">UNLIMITED. LLC</span>
        </footer>
      ) : null}
    </div>
  );
}

export function HomePage() {
  return (
    <React.Suspense
      fallback={<div className="pv-storefront min-h-svh bg-pv-bg" />}
    >
      <HomePageInner />
    </React.Suspense>
  );
}
