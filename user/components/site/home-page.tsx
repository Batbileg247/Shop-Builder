"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useShop } from "@/app/hooks/useShop";
import { useThemeStore } from "@/stores/useThemeStore";
import { ShopHero } from "@/app/components/shop";
import { buildHeroCarouselUrls } from "@/lib/shop-theme";
import {
  HeroShelfResizable,
  SHOP_PREVIEW_HOST_CLASS,
} from "@/app/components/shop/HeroShelfResizable";

import { ShopProductTeaser } from "./shop-product-teaser";
import { ShopProductDetailModal } from "./shop-product-detail-modal";
import { SiteHeader } from "./site-header";
import { storefrontNavBase } from "@/lib/site-paths";
import { CartDrawer } from "@/app/components/ecommerce/CartDrawer";

function HomePageInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const navBase = storefrontNavBase(pathname);

  const preset = useThemeStore((s) => s.preset);
  const heroTitle = useThemeStore((s) => s.heroTitle);
  const heroImage = useThemeStore((s) => s.heroImage);
  const primaryColor = useThemeStore((s) => s.primaryColor);
  const backgroundColor = useThemeStore((s) => s.backgroundColor);
  const textColor = useThemeStore((s) => s.textColor);
  const font = useThemeStore((s) => s.font);
  const radius = useThemeStore((s) => s.radius);
  const shop = useShop();

  const [detailProduct, setDetailProduct] = React.useState<
    (typeof shop.products)[number] | null
  >(null);
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [cartOpen, setCartOpen] = React.useState(false);
  const [giftWrap, setGiftWrap] = React.useState(false);

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
      heroImage,
      heroTitle,
      primaryColor,
      backgroundColor,
      textColor,
      font,
      radius,
    ],
  );

  const featured = React.useMemo(() => {
    const fp = shop.featuredProducts;
    if (fp.length > 0) return fp.slice(0, 6);
    return shop.products.slice(0, 6);
  }, [shop.featuredProducts, shop.products]);

  return (
    <div className="pv-storefront" data-theme={preset}>
      <SiteHeader />

      <section className="w-full px-6 py-8">
        <div className={SHOP_PREVIEW_HOST_CLASS}>
          <HeroShelfResizable
            theme={effectiveTheme}
            hero={
              <ShopHero
                fillContainer
                heroImages={buildHeroCarouselUrls(effectiveTheme)}
                theme={effectiveTheme}
              />
            }
            belowHero={
              <div className="min-h-0 flex-1 overflow-y-auto border-t border-pv-divider bg-pv-bg">
                <div className="px-4 py-10 sm:px-8">
                  <div className="mb-8 flex flex-col gap-1 border-b border-pv-divider pb-6">
                    <h2 className="text-lg font-semibold tracking-tight text-pv-fg sm:text-xl">
                      Featured Products
                    </h2>
                    <p className="text-sm text-pv-muted">
                      Жинхэнэ shop preview — preset/өнгө/радиус шууд нөлөөлнө.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-(--pv-product-gap,1rem) sm:grid-cols-2 lg:grid-cols-4">
                    {featured.map((p) => (
                      <ShopProductTeaser
                        key={p.id}
                        currency={shop.theme.currency}
                        onClick={() => openDetail(p)}
                        product={p}
                      />
                    ))}
                  </div>
                </div>
              </div>
            }
          />
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

      <footer className="mt-auto border-t border-pv-divider py-8 text-center text-xs text-pv-muted">
        © {new Date().getFullYear()} Store
      </footer>
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
