"use client";

import * as React from "react";

import {
  ShopPreviewBridge,
  ShopPreviewDashboardSyncProvider,
} from "@/components/dashboard/shop-preview-bridge";
import { ShopProvider } from "@/app/hooks/useShop";
import { BuilderUiProvider } from "@/context/builder-ui-context";
import { ensureAuthCookieFromSession } from "@/lib/auth-session";

export default function AdminShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  React.useEffect(() => {
    ensureAuthCookieFromSession();
  }, []);

  return (
    <ShopPreviewDashboardSyncProvider>
      <ShopProvider>
        <ShopPreviewBridge />
        <BuilderUiProvider>{children}</BuilderUiProvider>
      </ShopProvider>
    </ShopPreviewDashboardSyncProvider>
  );
}
