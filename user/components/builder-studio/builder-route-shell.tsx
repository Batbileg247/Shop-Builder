"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

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

function builderChromeTitle(pathname: string | null): string {
  if (!pathname) return "Theme studios";
  if (pathname.includes("/create")) return "Create shop";
  if (pathname.includes("/update")) return "Theme studios";
  return "Theme studio";
}

export function BuilderRouteShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const title = builderChromeTitle(pathname);

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
              <AdminDashboardChrome title={title} showViewDemo>
                {children}
              </AdminDashboardChrome>
            </AdminLayoutShell>
          </BuilderUiProvider>
        </ShopProvider>
      </ShopPreviewDashboardSyncProvider>
    </DashboardProvider>
  );
}
