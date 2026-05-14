"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { CheckoutSummary } from "@/app/components/ecommerce/CheckoutSummary";
import { useShop } from "@/app/hooks/useShop";
import { useStore } from "@/context/store-context";
import {
  categoriesForStorefrontResponse,
  fetchStorefrontBySlug,
  mapStorefrontProductsToShop,
  postStorefrontCheckout,
} from "@/lib/storefront-api";

import { StorefrontTopNav } from "./storefront-top-nav";

const STOREFRONT_GIFT_WRAP_FEE = 10_000;

function StorefrontCheckoutInner() {
  const params = useParams<{ slug: string }>();
  const slug =
    typeof params?.slug === "string" ? params.slug.trim() : "";
  const router = useRouter();
  const { basePath } = useStore();
  const shop = useShop();

  const [giftWrap, setGiftWrap] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!slug) return;
    if (shop.lastOrderId) return;
    if (shop.cartItems.length === 0) {
      router.replace(basePath || `/s/${slug}`);
    }
  }, [slug, shop.lastOrderId, shop.cartItems.length, router, basePath]);

  async function handleCheckout() {
    if (!slug || shop.cartItems.length === 0 || !shop.buyerName.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const totalWithGift =
        shop.cartTotal + (giftWrap ? STOREFRONT_GIFT_WRAP_FEE : 0);
      const { orderId } = await postStorefrontCheckout(slug, {
        buyerName: shop.buyerName.trim(),
        buyerEmail: shop.buyerEmail.trim(),
        giftWrap,
        totalPrice: totalWithGift,
        lines: shop.cartItems.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
        })),
      });
      const fresh = await fetchStorefrontBySlug(slug);
      const productList = Array.isArray(fresh.products) ? fresh.products : [];
      const safe = {
        ...fresh,
        categories: Array.isArray(fresh.categories) ? fresh.categories : [],
        products: productList,
        store: fresh.store,
      };
      shop.replaceProducts(
        mapStorefrontProductsToShop(productList),
        categoriesForStorefrontResponse(safe),
      );
      shop.acknowledgeRemoteOrder(orderId);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
    } finally {
      setBusy(false);
    }
  }

  if (!slug) {
    return (
      <div className="pv-storefront">
        <StorefrontTopNav />
        <main className="mx-auto max-w-lg px-6 py-16 text-center text-sm text-pv-muted">
          Дэлгүүрийн хаяг олдсонгүй.
        </main>
      </div>
    );
  }

  return (
    <div className="pv-storefront min-h-svh bg-pv-bg">
      <StorefrontTopNav />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link
            href={basePath}
            className="text-sm font-medium text-pv-muted underline-offset-2 hover:text-pv-link-hover hover:underline"
          >
            ← Дэлгүүр
          </Link>
        </div>
        {error ? (
          <p className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
            {error}
          </p>
        ) : null}
        <CheckoutSummary
          buyerEmail={shop.buyerEmail}
          buyerName={shop.buyerName}
          giftWrap={giftWrap}
          isCheckoutPending={busy}
          items={shop.cartItems}
          lastOrderId={shop.lastOrderId}
          onCheckout={() => {
            void handleCheckout();
          }}
          onContinueShopping={() => {
            shop.clearLastOrder();
            router.push(basePath);
          }}
          onGiftWrapChange={setGiftWrap}
          onRemoveLine={shop.clearCartItem}
          onViewCart={() => router.push(`${basePath}/cart`)}
          setBuyerEmail={shop.setBuyerEmail}
          setBuyerName={shop.setBuyerName}
          subtotal={shop.cartTotal}
        />
      </main>
    </div>
  );
}

export function CheckoutPage() {
  return (
    <React.Suspense
      fallback={
        <div className="pv-storefront min-h-svh bg-pv-bg">
          <StorefrontTopNav />
          <main className="mx-auto max-w-lg px-6 py-16 text-center text-sm text-pv-muted">
            Ачааллаж байна…
          </main>
        </div>
      }
    >
      <StorefrontCheckoutInner />
    </React.Suspense>
  );
}
