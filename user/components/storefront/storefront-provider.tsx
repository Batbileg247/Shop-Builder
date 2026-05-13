"use client";

import * as React from "react";

import { ShopProvider } from "@/app/hooks/useShop";
import { StoreProvider, useStore } from "@/context/store-context";

function StorefrontBootstrap({ slug }: { slug: string }) {
  const { setBasePath, setStoreSlug } = useStore();

  React.useEffect(() => {
    const clean = slug.trim();
    setStoreSlug(clean);
    setBasePath(`/s/${clean}`);
  }, [setBasePath, setStoreSlug, slug]);

  return null;
}

export function StorefrontProvider({
  slug,
  children,
}: {
  slug: string;
  children: React.ReactNode;
}) {
  return (
    <StoreProvider>
      <ShopProvider>
        <StorefrontBootstrap slug={slug} />
        {children}
      </ShopProvider>
    </StoreProvider>
  );
}

