"use client";

import * as React from "react";

import {
  ShopPreviewBridge,
  ShopPreviewDashboardSyncProvider,
} from "@/components/dashboard/shop-preview-bridge";
import {
  AdminDashboardChrome,
  AdminLayoutShell,
} from "@/components/admin-layout-shell";
import { BuilderStudioSidebarColumn } from "@/components/builder-studio/builder-studio-sidebar-column";
import { ShopProvider } from "@/app/hooks/useShop";
import { BuilderUiProvider } from "@/context/builder-ui-context";
import { DashboardProvider } from "@/context/DashboardContext";
import { ensureAuthCookieFromSession } from "@/lib/auth-session";

export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  React.useEffect(() => {
    ensureAuthCookieFromSession();
  }, []);

  return (
    <DashboardProvider>
      <ShopPreviewDashboardSyncProvider>
        <ShopProvider>
          <ShopPreviewBridge />
          <BuilderUiProvider>
            <AdminLayoutShell
              sidebarReplacement={<BuilderStudioSidebarColumn />}
            >
              <AdminDashboardChrome title="Theme studio">
                {children}
              </AdminDashboardChrome>
            </AdminLayoutShell>
          </BuilderUiProvider>
        </ShopProvider>
      </ShopPreviewDashboardSyncProvider>
    </DashboardProvider>
  );
}
