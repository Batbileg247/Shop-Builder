"use client";

import * as React from "react";
import Link from "next/link";
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
import type { Product, ProductDraft } from "@/types";
import { emptyDraft } from "@/lib/defaults";
import { Plus, Search, ShoppingBag, ShoppingCart, Menu, X } from "lucide-react";
import { Input } from "@/ui/input";

import { ShopProductDetailModal } from "./shop-product-detail-modal";
import { SiteHeader } from "./site-header";
import { useBuilderUi } from "@/context/builder-ui-context";
import { storefrontNavBase } from "@/lib/site-paths";
import { CartDrawer } from "@/app/components/ecommerce/CartDrawer";

const PREVIEW_SLOT_COUNT = 6;

function effectivePrice(p: Product) {
  return p.salePrice ?? p.price;
}

function AddProductSlot({ onClick }: { onClick: () => void }) {
  return (
    <article
      className={cn(
        "pv-card group flex cursor-pointer flex-col overflow-hidden border border-dashed border-pv-border bg-pv-empty shadow-pv-card transition hover:border-pv-primary hover:bg-pv-card hover:shadow-pv-card",
      )}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className="relative aspect-3/4 overflow-hidden bg-pv-placeholder">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-pv-card ring-1 ring-pv-border transition group-hover:ring-pv-primary">
            <Plus className="size-7 text-pv-fg" aria-hidden />
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-[length:var(--pv-card-content-pad,1rem)]">
        <div className="min-w-0">
          <h3 className="font-inter text-xl font-semibold leading-snug text-pv-fg">
            Add product
          </h3>
          <p className="mt-0.5 text-xs text-pv-muted">New listing</p>
        </div>
      </div>
    </article>
  );
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
  const heroGallery = useThemeStore((s) => s.heroGallery);
  const shopName = useThemeStore((s) => s.shopName);
  const heroAnnouncement = useThemeStore((s) => s.heroAnnouncement);
  const primaryColor = useThemeStore((s) => s.primaryColor);
  const backgroundColor = useThemeStore((s) => s.backgroundColor);
  const textColor = useThemeStore((s) => s.textColor);
  const font = useThemeStore((s) => s.font);
  const radius = useThemeStore((s) => s.radius);
  const shop = useShop();
  const { isDemo, heroPanelPercent, setHeroPanelPercent } = useBuilderUi();

  const isStorefront = pathname.startsWith("/s/");
  const fullSiteShell = isDemo || isStorefront;
  const isEmbeddedCustomize = pathname.startsWith("/admin/customize");

  const catalogFull = searchParams.get("view") === "all";
  const previewHostClass = fullSiteShell
    ? SHOP_PREVIEW_HOST_DEMO_CLASS
    : isEmbeddedCustomize
      ? "flex h-full min-h-0 w-full flex-1"
      : SHOP_PREVIEW_HOST_CLASS;

  const [searchQuery, setSearchQuery] = React.useState("");
  const [detailProduct, setDetailProduct] = React.useState<
    (typeof shop.products)[number] | null
  >(null);
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [cartOpen, setCartOpen] = React.useState(false);
  const [giftWrap, setGiftWrap] = React.useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = React.useState(false);
  const [previewCategory, setPreviewCategory] = React.useState<string>("All");
  const [priceSort, setPriceSort] = React.useState<PriceSortMode>("none");
  const [addProductOpen, setAddProductOpen] = React.useState(false);
  const [newProductDraft, setNewProductDraft] =
    React.useState<ProductDraft>(emptyDraft);

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

  const openAddProductSheet = () => {
    setNewProductDraft({ ...emptyDraft });
    setAddProductOpen(true);
  };

  const submitNewProduct = () => {
    const d = newProductDraft;
    if (!d.name.trim() || !d.image.trim() || !d.category.trim()) return;
    shop.addProduct(d);
    setAddProductOpen(false);
    setNewProductDraft({ ...emptyDraft });
  };

  const effectiveTheme = React.useMemo(
    () => ({
      ...shop.theme,
      name: shopName,
      announcement: heroAnnouncement,
      heroImage,
      heroGallery,
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
      heroGallery,
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
    const set = new Set<string>();
    for (const p of shop.products) {
      if (p.category) set.add(p.category);
    }
    for (const c of shop.categories) {
      if (c) set.add(c);
    }
    return ["All", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [shop.products, shop.categories]);

  // Хайлтын шүүлтүүртэй Preview Pool
  const previewPool = React.useMemo(() => {
    let pool =
      previewCategory === "All"
        ? shop.products
        : shop.products.filter((p) => p.category === previewCategory);

    if (searchQuery.trim() !== "") {
      pool = pool.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
    return pool;
  }, [shop.products, previewCategory, searchQuery]);

  const previewSlotProducts = React.useMemo(
    () => previewPool.slice(0, PREVIEW_SLOT_COUNT),
    [previewPool],
  );

  const addProductSlotCount = React.useMemo(() => {
    if (previewPool.length > PREVIEW_SLOT_COUNT) return 0;
    return Math.max(0, PREVIEW_SLOT_COUNT - previewSlotProducts.length);
  }, [previewPool.length, previewSlotProducts.length]);

  // Хайлтын шүүлтүүртэй Catalog
  const filteredCatalog = React.useMemo(() => {
    let items = applyCatalogFilters(
      shop.products,
      shop.catalogFilterDefinitions,
      filterSelections,
    );

    if (searchQuery.trim() !== "") {
      items = items.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
    return items;
  }, [
    shop.products,
    shop.catalogFilterDefinitions,
    filterSelections,
    searchQuery,
  ]);

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
        fullSiteShell
          ? "w-full lg:flex-row lg:items-start"
          : "flex-1 lg:flex-row",
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
            <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-pv-fg sm:text-4xl">
              All Products
            </h1>
            <p className="mt-2 text-sm text-pv-muted">
              {filteredCatalog.length} items found
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              className="lg:hidden"
              onClick={() => setMobileFiltersOpen(true)}
              variant="outline"
            >
              Filters
            </Button>
            <Button onClick={goPreviewCatalog} variant="outline">
              ← Back
            </Button>
          </div>
        </div>

        {filteredCatalog.length > 0 ? (
          <ProductGrid
            brandLabel={brandLabel}
            onProductOpen={openDetail}
            products={catalogSorted}
            variant="dense"
          />
        ) : (
          <div className="py-20 text-center">
            <p className="text-pv-muted text-lg">
              No products found matching your search.
            </p>
          </div>
        )}
      </main>
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
              key={cat}
              className={cn(
                "pv-chip rounded-full px-4 py-2 text-sm font-medium",
                previewCategory === cat && "pv-chip-active",
              )}
              onClick={() => setPreviewCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-(--pv-product-gap,1.5rem) sm:grid-cols-2 lg:grid-cols-3">
          {previewSlotProducts.map((p) => (
            <ProductCard
              brandLabel={p.category}
              key={p.id}
              onOpen={() => openDetail(p)}
              product={p}
            />
          ))}
          {searchQuery === "" &&
            Array.from({ length: addProductSlotCount }).map((_, i) => (
              <AddProductSlot
                key={`add-slot-${i}`}
                onClick={openAddProductSheet}
              />
            ))}
        </div>

        {previewPool.length === 0 && (
          <div className="py-10 text-center">
            <p className="text-pv-muted">No products found.</p>
          </div>
        )}

        <div className="mt-10 flex justify-center">
          <Button
            className="pv-btn-primary min-w-[200px] px-10 py-6 text-base font-semibold"
            onClick={goFullCatalog}
          >
            Explore All
          </Button>
        </div>
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
          : isEmbeddedCustomize
            ? "h-full min-h-0 min-w-0 flex-1"
            : "min-h-svh",
      )}
      data-theme={preset}
    >
      {!isDemo || isStorefront ? <SiteHeader /> : null}

      <section
        className={cn(
          "flex w-full flex-col",
          fullSiteShell
            ? "w-full"
            : "min-h-0 flex-1 flex-col overflow-hidden px-6 py-8",
        )}
      >
        <div className={previewHostClass}>
          <div
            className={cn(
              "flex w-full max-w-full flex-col overflow-hidden rounded-2xl border border-slate-200/90 shadow-sm",
              !fullSiteShell && "h-full min-h-0",
            )}
            style={shopPreviewShellStyle(effectiveTheme)}
          >
            {/* Шинэчлэгдсэн Header */}
            <header className="pv-header sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-pv-divider bg-pv-header/80 px-4 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <Link href={navBase} className="flex items-center gap-2 group">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-pv-primary text-white shadow-sm">
                    <ShoppingBag className="size-5" />
                  </div>
                  <span className="hidden text-lg font-bold text-pv-fg sm:block">
                    {effectiveTheme.name}
                  </span>
                </Link>
              </div>

              {/* Search Bar */}
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-pv-muted" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 w-full rounded-full border border-pv-divider bg-pv-card pl-10 pr-10 text-sm outline-none focus:ring-2 focus:ring-pv-primary/20"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-pv-muted hover:text-pv-fg"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  className="hidden items-center gap-2 sm:flex"
                  onClick={goFullCatalog}
                >
                  <span>Shop</span>
                </Button>
                <button
                  onClick={() => setCartOpen(true)}
                  className="relative flex size-10 items-center justify-center rounded-full text-pv-fg hover:bg-pv-card"
                >
                  <ShoppingCart className="size-5" />
                  {shop.cartItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-pv-primary text-[10px] font-bold text-white ring-2 ring-pv-header">
                      {shop.cartItems.length}
                    </span>
                  )}
                </button>
              </div>
            </header>

            {catalogFull ? (
              fullShopLayout
            ) : (
              <HeroShelfResizable
                belowHero={previewBelowHero}
                hero={
                  <div className="flex h-full min-h-0 flex-col overflow-hidden">
                    <div className="min-h-0 flex-1 overflow-hidden">
                      <ShopHero
                        fillContainer
                        heroImages={buildHeroCarouselUrls(effectiveTheme)}
                        theme={effectiveTheme}
                      />
                    </div>
                  </div>
                }
                heroSizePercent={heroPanelPercent}
                locked={fullSiteShell}
                onHeroPercentChange={setHeroPanelPercent}
                theme={effectiveTheme}
              />
            )}
          </div>
        </div>
      </section>

      {/* Product Detail Modal, Cart Drawer and Add Product Sheet... */}
      {/* (Хуучин код хэвээрээ үргэлжилнэ) */}
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
          router.replace(
            next.toString() ? `${pathname}?${next.toString()}` : pathname,
          );
        }}
        onRemoveLine={shop.clearCartItem}
        onViewFullCart={() => router.push(`${navBase}/cart`)}
        open={cartOpen}
        subtotal={shop.cartTotal}
      />

      {!fullSiteShell && (
        <footer className="mt-auto border-t border-pv-divider py-8 text-center text-xs text-pv-muted">
          © {new Date().getFullYear()} Developed for Online Commerce by{" "}
          <span className="font-bold">UNLIMITED. LLC</span>
        </footer>
      )}
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
