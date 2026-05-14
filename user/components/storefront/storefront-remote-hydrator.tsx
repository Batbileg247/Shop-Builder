"use client";

import * as React from "react";

import { useShop } from "@/app/hooks/useShop";
import { ACTIVE_SHOP_SESSION_KEY } from "@/context/DashboardContext";
import { getAuthSession } from "@/lib/auth-session";
import {
  categoriesForStorefrontResponse,
  fetchStorefrontBySlug,
  mapStorefrontProductsToShop,
} from "@/lib/storefront-api";
import { useThemeStore } from "@/stores/useThemeStore";

type Props = {
  slug: string;
  onOwnerHydrated: (isOwner: boolean) => void;
};

export function StorefrontRemoteHydrator({ slug, onOwnerHydrated }: Props) {
  const { replaceProducts } = useShop();
  const onOwnerHydratedRef = React.useRef(onOwnerHydrated);
  onOwnerHydratedRef.current = onOwnerHydrated;

  React.useEffect(() => {
    const clean = slug.trim();
    if (!clean) return;
    let cancelled = false;

    (async () => {
      let isOwner = false;
      try {
        const data = await fetchStorefrontBySlug(clean);
        if (cancelled) return;

        const ownerId =
          typeof data.store.ownerId === "string" ? data.store.ownerId : "";
        const session = getAuthSession();
        const uid = session?.user?.id;
        if (ownerId && uid && ownerId === uid && data.store.id) {
          try {
            sessionStorage.setItem(ACTIVE_SHOP_SESSION_KEY, data.store.id);
          } catch {
            /* ignore */
          }
          isOwner = true;
        }

        if (data.store.themeConfig != null) {
          useThemeStore
            .getState()
            .applyPersistedSiteTheme(data.store.themeConfig);
        }

        const productList = Array.isArray(data.products) ? data.products : [];
        const safe: typeof data = {
          ...data,
          categories: Array.isArray(data.categories) ? data.categories : [],
          products: productList,
          store: data.store,
        };
        replaceProducts(
          mapStorefrontProductsToShop(productList),
          categoriesForStorefrontResponse(safe),
        );
      } catch (e) {
        console.error("[storefront]", e);
        isOwner = false;
      }

      if (!cancelled) {
        onOwnerHydratedRef.current(isOwner);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slug, replaceProducts]);

  return null;
}
