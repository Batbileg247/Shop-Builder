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
import { Plus } from "lucide-react";
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
          <p className="mt-1 text-[11px] text-pv-muted">
            Same form for every slot
          </p>
        </div>
        <div className="mt-auto flex items-end justify-between gap-2 border-t border-pv-divider pt-3">
          <p className="text-sm font-medium text-pv-muted">Demo slot</p>
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

  /** Жинхэнэ storefront (`/s/...`) — builder preview-ийн хүрээгүй, View Demo-тэй ижил бүтэн site. */
  const isStorefront = pathname.startsWith("/s/");
  const fullSiteShell = isDemo || isStorefront;
  const isEmbeddedCustomize = pathname.startsWith("/admin/customize");

  const catalogFull = searchParams.get("view") === "all";
  const previewHostClass = fullSiteShell
    ? SHOP_PREVIEW_HOST_DEMO_CLASS
    : isEmbeddedCustomize
      ? "flex h-full min-h-0 w-full flex-1"
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

  const previewPool = React.useMemo(() => {
    if (previewCategory === "All") return shop.products;
    return shop.products.filter((p) => p.category === previewCategory);
  }, [shop.products, previewCategory]);

  const previewSlotProducts = React.useMemo(
    () => previewPool.slice(0, PREVIEW_SLOT_COUNT),
    [previewPool],
  );

  const addProductSlotCount = React.useMemo(() => {
    if (previewPool.length > PREVIEW_SLOT_COUNT) return 0;
    return Math.max(0, PREVIEW_SLOT_COUNT - previewSlotProducts.length);
  }, [previewPool.length, previewSlotProducts.length]);

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
                "pv-chip rounded-full px-4 py-2 text-sm font-medium",
                previewCategory === cat && "pv-chip-active",
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
          {previewSlotProducts.map((p) => (
            <ProductCard
              brandLabel={p.category}
              key={p.id}
              onOpen={() => openDetail(p)}
              product={p}
            />
          ))}
          {Array.from({ length: addProductSlotCount }).map((_, i) => (
            <AddProductSlot
              key={`add-slot-${i}`}
              onClick={openAddProductSheet}
            />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Button
            className="pv-btn-primary min-w-[200px] px-10 py-6 text-base font-semibold"
            onClick={goFullCatalog}
            type="button"
          >
            View More
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
        {catalogFull ? (
          <div className={previewHostClass}>
            <div
              className={cn(
                "flex w-full max-w-full flex-col overflow-hidden rounded-2xl border border-slate-200/90 shadow-sm",
                !fullSiteShell && "h-full min-h-0",
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
                <div className="flex h-full min-h-0 flex-col overflow-hidden">
                  <header className="pv-header flex h-11 shrink-0 items-center justify-between gap-3 px-4 sm:h-12 sm:px-5">
                    <Link
                      href={navBase}
                      className={cn(
                        "rounded-[length:var(--pv-radius)] px-1 py-0.5 text-sm font-semibold tracking-tight text-pv-fg",
                        "pv-interactive transition-none",
                      )}
                    >
                      Store
                    </Link>
                    <span className="truncate text-right text-xs font-medium text-pv-muted sm:text-sm">
                      {effectiveTheme.name}
                    </span>
                  </header>
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
          </div>
        )}
      </section>

      <Sheet onOpenChange={setAddProductOpen} open={addProductOpen}>
        <SheetContent
          className="flex w-full max-w-md flex-col gap-0 overflow-y-auto sm:max-w-lg"
          showCloseButton
          side="right"
        >
          <SheetHeader className="border-b border-pv-divider px-4 py-3">
            <SheetTitle className="text-pv-fg">Add product</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-4 p-4">
            <datalist id="builder-product-categories">
              {shop.categories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
            <label className="grid gap-1.5 text-sm">
              <span className="font-medium text-pv-fg">Product photo</span>
              <input
                accept="image/*"
                className="text-xs text-pv-muted file:mr-3 file:rounded-md file:border file:border-pv-border file:bg-pv-card file:px-3 file:py-2 file:text-sm file:font-medium"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => {
                    setNewProductDraft((prev) => ({
                      ...prev,
                      image: String(reader.result ?? ""),
                    }));
                  };
                  reader.readAsDataURL(file);
                }}
                type="file"
              />
            </label>
            <label className="grid gap-1.5 text-sm">
              <span className="font-medium text-pv-fg">Name</span>
              <Input
                className="border-pv-border"
                onChange={(e) =>
                  setNewProductDraft((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="Product name"
                value={newProductDraft.name}
              />
            </label>
            <label className="grid gap-1.5 text-sm">
              <span className="font-medium text-pv-fg">Category</span>
              <Input
                className="border-pv-border"
                list="builder-product-categories"
                onChange={(e) =>
                  setNewProductDraft((p) => ({
                    ...p,
                    category: e.target.value,
                  }))
                }
                placeholder="Type or pick a category"
                value={newProductDraft.category}
              />
            </label>
            <label className="grid gap-1.5 text-sm">
              <span className="font-medium text-pv-fg">Size</span>
              <Input
                className="border-pv-border"
                onChange={(e) =>
                  setNewProductDraft((p) => ({ ...p, size: e.target.value }))
                }
                placeholder="e.g. M, 42, One size"
                value={newProductDraft.size}
              />
            </label>
            <label className="grid gap-1.5 text-sm">
              <span className="font-medium text-pv-fg">Description</span>
              <textarea
                className="min-h-[88px] rounded-md border border-pv-border bg-pv-card px-3 py-2 text-sm text-pv-fg outline-none focus:ring-2 focus:ring-pv-primary/25"
                onChange={(e) =>
                  setNewProductDraft((p) => ({
                    ...p,
                    description: e.target.value,
                  }))
                }
                placeholder="Short description"
                value={newProductDraft.description}
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="grid gap-1.5 text-sm">
                <span className="font-medium text-pv-fg">Price</span>
                <Input
                  className="border-pv-border"
                  min={0}
                  onChange={(e) =>
                    setNewProductDraft((p) => ({
                      ...p,
                      price: Number(e.target.value) || 0,
                    }))
                  }
                  type="number"
                  value={newProductDraft.price}
                />
              </label>
              <label className="grid gap-1.5 text-sm">
                <span className="font-medium text-pv-fg">Sale (optional)</span>
                <Input
                  className="border-pv-border"
                  min={0}
                  onChange={(e) =>
                    setNewProductDraft((p) => ({
                      ...p,
                      salePrice: e.target.value,
                    }))
                  }
                  placeholder="—"
                  type="number"
                  value={newProductDraft.salePrice}
                />
              </label>
            </div>
            <label className="grid gap-1.5 text-sm">
              <span className="font-medium text-pv-fg">In stock</span>
              <Input
                className="border-pv-border"
                min={0}
                onChange={(e) =>
                  setNewProductDraft((p) => ({
                    ...p,
                    inventory: Number(e.target.value) || 0,
                  }))
                }
                type="number"
                value={newProductDraft.inventory}
              />
            </label>
            <label className="grid gap-1.5 text-sm">
              <span className="font-medium text-pv-fg">Featured</span>
              <select
                className="h-10 w-full rounded-md border border-pv-border bg-pv-card px-3 text-sm text-pv-fg"
                onChange={(e) =>
                  setNewProductDraft((p) => ({
                    ...p,
                    featured: e.target.value as ProductDraft["featured"],
                  }))
                }
                value={newProductDraft.featured}
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </label>
            <p className="text-xs text-pv-muted">
              Name, photo, and category are required before saving.
            </p>
            <div className="flex gap-2 pt-2">
              <Button
                className="flex-1 pv-btn-primary"
                disabled={
                  !newProductDraft.name.trim() ||
                  !newProductDraft.image.trim() ||
                  !newProductDraft.category.trim()
                }
                onClick={submitNewProduct}
                type="button"
              >
                Save product
              </Button>
              <Button
                onClick={() => setAddProductOpen(false)}
                type="button"
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

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
