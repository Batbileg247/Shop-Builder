"use client";

import * as React from "react";

import { ShopProvider } from "@/app/hooks/useShop";
import { BuilderUiProvider } from "@/context/builder-ui-context";
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
  return (
    <StoreProvider>
      <ShopProvider>
        <BuilderUiProvider>
          <StorefrontBootstrap shopId={shopId} />
          {children}
        </BuilderUiProvider>
      </ShopProvider>
    </StoreProvider>
  );
}

