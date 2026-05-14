"use client";

import * as React from "react";
import type { ReactNode } from "react";

import { useShop } from "@/app/hooks/useShop";
import { ShopPreviewDashboardSyncContext } from "@/context/shop-preview-dashboard-sync-context";
import { useDashboard } from "@/context/DashboardContext";
import {
  mapDashboardProductToStorefront,
  mapProductDraftToNewProductInput,
} from "@/lib/map-dashboard-product-to-storefront";
import type { ProductDraft } from "@/types";

export function ShopPreviewDashboardSyncProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { addProduct } = useDashboard();

  const value = React.useMemo(
    () => ({
      persistAddFromDraft: (draft: ProductDraft) => {
        addProduct(mapProductDraftToNewProductInput(draft));
      },
    }),
    [addProduct],
  );

  return (
    <ShopPreviewDashboardSyncContext.Provider value={value}>
      {children}
    </ShopPreviewDashboardSyncContext.Provider>
  );
}

/** Syncs dashboard catalog for the active shop into `useShop` (builder + admin shop preview). */
export function ShopPreviewBridge() {
  const { activeShop, products, categories } = useDashboard();
  const { replaceProducts } = useShop();

  React.useEffect(() => {
    replaceProducts(
      products.map(mapDashboardProductToStorefront),
      categories,
    );
  }, [activeShop.id, products, categories, replaceProducts]);

  return null;
}
