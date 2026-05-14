"use client";

import * as React from "react";
import { createPortal } from "react-dom";
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
import { Plus, Search, ShoppingBag, ShoppingCart, X } from "lucide-react";

import { ProductForm } from "@/app/components/admin/ProductForm";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/ui/sheet";
import { ShopProductDetailModal } from "./shop-product-detail-modal";
import { useBuilderUi } from "@/context/builder-ui-context";
import { useDashboard } from "@/context/DashboardContext";
import { isBuilderPreviewPath, storefrontNavBase } from "@/lib/site-paths";
import { CartDrawer } from "@/app/components/ecommerce/CartDrawer";

function effectivePrice(p: Product) {
  return p.salePrice ?? p.price;
}

function AddProductSlot({ onClick }: { onClick: () => void }) {
  return (
    <article
      className={cn(
        "pv-card group flex h-full min-h-0 cursor-pointer flex-col overflow-hidden border border-dashed border-pv-border bg-pv-empty shadow-pv-card transition hover:border-pv-primary hover:bg-pv-card hover:shadow-pv-card",
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
      <div className="relative aspect-3/4 shrink-0 overflow-hidden bg-pv-placeholder">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-pv-card ring-1 ring-pv-border transition group-hover:ring-pv-primary">
            <Plus className="size-7 text-pv-fg" aria-hidden />
          </span>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-2 p-(--pv-card-content-pad,1rem)">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-inter text-xl font-semibold leading-snug text-pv-fg">
              Add product
            </h3>
            <p className="mt-0.5 text-xs text-pv-muted">New listing</p>
            <p className="mt-0.5 text-xs text-pv-muted opacity-0" aria-hidden>
              —
            </p>
            <p className="mt-1 text-[11px] text-pv-muted opacity-0" aria-hidden>
              (0.0k) Customer Reviews
            </p>
          </div>
        </div>

        <div className="mt-auto flex items-end justify-between gap-2 border-t border-pv-divider pt-3">
          <div>
            <p className="text-lg font-semibold text-transparent select-none">
              $00
            </p>
          </div>
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

/** Only mounted under `/builder` / `/building` where {@link DashboardProvider} exists. */
function PreviewCategoryAddControl() {
  const { addCategory, categories } = useDashboard();
  const [modalOpen, setModalOpen] = React.useState(false);
  const [newName, setNewName] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [portalReady, setPortalReady] = React.useState(false);

  React.useEffect(() => {
    setPortalReady(true);
  }, []);

  const close = React.useCallback(() => {
    setModalOpen(false);
    setNewName("");
    setError(null);
  }, []);

  const save = React.useCallback(() => {
    const n = newName.trim();
    if (!n) {
      setError("Enter a category name.");
      return;
    }
    if (categories.some((c) => c.toLowerCase() === n.toLowerCase())) {
      setError("That category already exists.");
      return;
    }
    addCategory(n);
    close();
  }, [addCategory, categories, newName, close]);

  return (
    <>
      <button
        type="button"
        aria-label="Add category"
        className={cn(
          "pv-chip inline-flex size-10 shrink-0 items-center justify-center rounded-full p-0 text-pv-fg",
          "ring-1 ring-transparent hover:ring-pv-primary/40",
        )}
        onClick={() => {
          setError(null);
          setModalOpen(true);
        }}
      >
        <Plus className="size-4" aria-hidden />
      </button>
      {portalReady && modalOpen
        ? createPortal(
            <div
              className="fixed inset-0 z-[400] flex items-center justify-center bg-black/50 p-4"
              onClick={close}
              role="presentation"
            >
              <div
                aria-labelledby="preview-add-cat-title"
                aria-modal="true"
                className="w-full max-w-md rounded-2xl border border-pv-border bg-pv-card p-6 shadow-lg"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
              >
                <h2
                  className="text-lg font-semibold text-pv-fg"
                  id="preview-add-cat-title"
                >
                  Add category
                </h2>
                <p className="mt-1 text-sm text-pv-muted">
                  Saved for this shop and available when adding products.
                </p>
                <label
                  className="mt-4 block text-sm font-medium text-pv-fg"
                  htmlFor="preview-new-category"
                >
                  Category name
                </label>
                <input
                  id="preview-new-category"
                  autoFocus
                  className="mt-1.5 w-full rounded-xl border border-pv-border bg-pv-bg px-3 py-2.5 text-sm text-pv-fg outline-none focus:ring-2 focus:ring-pv-primary/30"
                  onChange={(e) => {
                    setNewName(e.target.value);
                    setError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      save();
                    }
                  }}
                  placeholder="e.g. Accessories"
                  value={newName}
                />
                {error ? (
                  <p className="mt-2 text-sm font-medium text-red-600">{error}</p>
                ) : null}
                <div className="mt-5 flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-pv-border"
                    onClick={close}
                  >
                    Cancel
                  </Button>
                  <Button type="button" className="pv-btn-primary" onClick={save}>
                    Save
                  </Button>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
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
  const previewProductCardBasisRem = useThemeStore(
    (s) => s.previewProductCardBasisRem,
  );
  const shop = useShop();
  const { isDemo, heroPanelPercent, setHeroPanelPercent } = useBuilderUi();

  const isStorefront = pathname.startsWith("/s/");
  const fullSiteShell = isDemo || isStorefront;
  /** Theme studio (`/builder/...`) and landing create (`/building/...`) use the dashboard main column, not full viewport. */
  const isEmbeddedDashboardPreview = isBuilderPreviewPath(pathname);

  const catalogFull = searchParams.get("view") === "all";
  const previewHostClass = fullSiteShell
    ? SHOP_PREVIEW_HOST_DEMO_CLASS
    : isEmbeddedDashboardPreview
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
  const [addProductError, setAddProductError] = React.useState<string | null>(
    null,
  );

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

  const toggleCart = (open: boolean) => {
    setCartOpen(open);
    const next = new URLSearchParams(searchParams.toString());
    if (open) next.set("cart", "open");
    else next.delete("cart");
    router.replace(
      next.toString() ? `${pathname}?${next.toString()}` : pathname,
      { scroll: false },
    );
  };

  const openDetail = (p: (typeof shop.products)[number]) => {
    setDetailProduct(p);
    setDetailOpen(true);
  };

  const openAddProductSheet = () => {
    setAddProductError(null);
    setNewProductDraft({ ...emptyDraft });
    setAddProductOpen(true);
  };

  const handleAddProductSheetOpen = (open: boolean) => {
    setAddProductOpen(open);
    if (!open) setAddProductError(null);
  };

  const handleAddProductSubmit = () => {
    if (!newProductDraft.name.trim() || !newProductDraft.image.trim()) {
      setAddProductError(
        "Enter a product name and choose an image (swipe the samples or paste a URL).",
      );
      return;
    }
    if (isEmbeddedDashboardPreview) {
      if (shop.categories.length === 0) {
        setAddProductError(
          "Add at least one category with the + button next to the preview category filters, then try again.",
        );
        return;
      }
      if (
        !newProductDraft.category.trim() ||
        !shop.categories.includes(newProductDraft.category)
      ) {
        setAddProductError("Choose a category from your shop list.");
        return;
      }
    }
    setAddProductError(null);
    shop.addProduct(newProductDraft);
    setAddProductOpen(false);
    setNewProductDraft({ ...emptyDraft });
  };

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

  const previewProductsWrapStyle = React.useMemo(
    () =>
      ({
        "--pv-preview-card-basis": `${previewProductCardBasisRem}rem`,
      }) as React.CSSProperties,
    [previewProductCardBasisRem],
  );

  const previewProductItemStyle = React.useMemo(
    () =>
      ({
        /* grow: 0 — last row must not stretch a lone “add product” card to full width */
        flex: "0 1 min(100%, var(--pv-preview-card-basis, 14rem))",
        minWidth: 0,
        maxWidth: "min(100%, var(--pv-preview-card-basis, 14rem))",
      }) as React.CSSProperties,
    [],
  );

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

  const goFullCatalog = () =>
    router.replace(mergeSearchParams(pathname, searchParams, { view: "all" }));
  const goPreviewCatalog = () =>
    router.replace(mergeSearchParams(pathname, searchParams, { view: null }));

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
            ? "w-full border-b px-4 py-6 lg:w-70 lg:border-r lg:border-b-0 lg:shrink-0 sm:px-6"
            : "hidden w-70 overflow-y-auto border-r lg:block",
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
              type="button"
            >
              {cat}
            </button>
          ))}
          {isEmbeddedDashboardPreview ? <PreviewCategoryAddControl /> : null}
        </div>

        <div
          className="flex w-full min-w-0 flex-wrap justify-center gap-(--pv-product-gap,1.5rem)"
          style={previewProductsWrapStyle}
        >
          {previewPool.map((p) => (
            <div
              key={p.id}
              className="flex min-h-0 min-w-0 flex-col"
              style={previewProductItemStyle}
            >
              <ProductCard
                brandLabel={p.category}
                onOpen={() => openDetail(p)}
                product={p}
              />
            </div>
          ))}
          {searchQuery === "" ? (
            <div
              key="add-product-slot"
              className="flex min-h-0 min-w-0 flex-col"
              style={previewProductItemStyle}
            >
              <AddProductSlot onClick={openAddProductSheet} />
            </div>
          ) : null}
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
            : "w-full"
          : isEmbeddedDashboardPreview
            ? "h-full min-h-0 min-w-0 flex-1"
            : "min-h-svh",
      )}
      data-theme={preset}
    >
      <section
        className={cn(
          "flex w-full flex-col",
          fullSiteShell
            ? "w-full"
            : "min-h-0 flex-1 flex-col overflow-hidden",
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
            {/* Header with Search and Cart */}
            <header className="pv-header sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-pv-divider bg-pv-header/80 px-4 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <Link
                  href={navBase}
                  className="flex items-center gap-2 group"
                >
                  <div className="flex size-9 items-center justify-center rounded-lg bg-pv-primary text-white shadow-sm">
                    <ShoppingBag className="size-5" />
                  </div>
                  <span className="hidden text-lg font-bold text-pv-fg sm:block">
                    {effectiveTheme.name}
                  </span>
                </Link>
              </div>

              <div className="relative flex-1 max-w-sm mx-4">
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
                  className="hidden sm:flex"
                  onClick={goFullCatalog}
                >
                  Shop
                </Button>
                <button
                  onClick={() => toggleCart(true)}
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
        onOpenChange={toggleCart}
        onRemoveLine={shop.clearCartItem}
        onViewFullCart={() => router.push(`${navBase}/cart`)}
        open={cartOpen}
        subtotal={shop.cartTotal}
      />

      <Sheet onOpenChange={handleAddProductSheetOpen} open={addProductOpen}>
        <SheetContent
          className="flex w-full max-w-lg! flex-col border-l border-pv-divider bg-pv-bg p-0 sm:max-w-lg!"
          showCloseButton
          side="right"
        >
          <SheetHeader className="border-b border-pv-divider px-6 pt-10">
            <SheetTitle className="text-2xl font-semibold text-pv-fg">
              Add product
            </SheetTitle>
            <SheetDescription className="text-pv-muted">
              New products are saved to your active shop and appear in this
              preview.
            </SheetDescription>
            {addProductError ? (
              <p className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">
                {addProductError}
              </p>
            ) : null}
          </SheetHeader>
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
            <ProductForm
              categoryOptions={
                isEmbeddedDashboardPreview ? shop.categories : undefined
              }
              draft={newProductDraft}
              mode="create"
              onCancel={() => handleAddProductSheetOpen(false)}
              onSubmit={handleAddProductSubmit}
              setDraft={setNewProductDraft}
              theme={effectiveTheme}
            />
          </div>
        </SheetContent>
      </Sheet>

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
