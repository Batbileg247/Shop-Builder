"use client";

import * as React from "react";

import { ShopProvider } from "@/app/hooks/useShop";
import {
  ShopPreviewBridge,
  ShopPreviewDashboardSyncProvider,
} from "@/components/dashboard/shop-preview-bridge";
import { StorefrontRemoteHydrator } from "@/components/storefront/storefront-remote-hydrator";
import { BuilderUiProvider } from "@/context/builder-ui-context";
import { DashboardProvider } from "@/context/DashboardContext";
import { StorefrontCatalogEditProvider } from "@/context/storefront-catalog-edit-context";
import { ThemeStoreShopPersistenceSync } from "@/context/theme-store-shop-persistence-sync";
import { StoreProvider, useStore } from "@/context/store-context";

function StorefrontBootstrap({ shopId }: { shopId: string }) {
  const { setBasePath, setStoreSlug } = useStore();

  React.useEffect(() => {
    const clean = shopId.trim();
    setStoreSlug(clean);
    setBasePath(`/s/${clean}`);
  }, [setBasePath, setStoreSlug, shopId]);

  return null;
}

export function StorefrontProvider({
  shopId,
  children,
}: {
  shopId: string;
  children: React.ReactNode;
}) {
  const [merchantOwnerShell, setMerchantOwnerShell] = React.useState(false);
  const onOwnerHydrated = React.useCallback((isOwner: boolean) => {
    setMerchantOwnerShell(isOwner);
  }, []);

  const inner = (
    <>
      <StorefrontBootstrap shopId={shopId} />
      <StorefrontRemoteHydrator
        slug={shopId}
        onOwnerHydrated={onOwnerHydrated}
      />
      {merchantOwnerShell ? <ShopPreviewBridge /> : null}
      {children}
    </>
  );

  return (
    <StoreProvider>
      <StorefrontCatalogEditProvider value={merchantOwnerShell}>
        {merchantOwnerShell ? (
          <DashboardProvider>
            <ThemeStoreShopPersistenceSync />
            <ShopPreviewDashboardSyncProvider>
              <ShopProvider>
                <BuilderUiProvider>{inner}</BuilderUiProvider>
              </ShopProvider>
            </ShopPreviewDashboardSyncProvider>
          </DashboardProvider>
        ) : (
          <ShopProvider>
            <BuilderUiProvider>{inner}</BuilderUiProvider>
          </ShopProvider>
        )}
      </StorefrontCatalogEditProvider>
    </StoreProvider>
  );
}

