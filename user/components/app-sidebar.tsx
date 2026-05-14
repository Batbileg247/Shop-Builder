"use client";

import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { LayoutPanelTopIcon, ShieldIcon, ShoppingBagIcon } from "lucide-react";

type Surface = "builder" | "admin" | "client";

export function AppSidebar({
  surface,
  setSurface,
  shopName,
  className,
}: {
  surface: Surface;
  setSurface: (surface: Surface) => void;
  shopName: string;
  className?: string;
}) {
  return (
    <Sidebar collapsible="icon" variant="inset" className={className}>
      <SidebarHeader className="gap-3 group-data-[collapsible=icon]:hidden">
        <div className="px-1">
          <p className="truncate text-sm font-semibold uppercase tracking-wider text-sidebar-primary">
            Shop builder
          </p>
          <p className="truncate text-lg font-semibold text-sidebar-foreground">
            {shopName}
          </p>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <div className="p-3">
          <SidebarMenu className="gap-1">
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={surface === "builder"}
                size="lg"
                tooltip="Builder"
                render={
                  <button onClick={() => setSurface("builder")} type="button">
                    <LayoutPanelTopIcon />
                    <span>Builder</span>
                  </button>
                }
              />
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={surface === "admin"}
                size="lg"
                tooltip="Admin"
                render={
                  <button onClick={() => setSurface("admin")} type="button">
                    <ShieldIcon />
                    <span>Admin</span>
                  </button>
                }
              />
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={surface === "client"}
                size="lg"
                tooltip="Storefront"
                render={
                  <button onClick={() => setSurface("client")} type="button">
                    <ShoppingBagIcon />
                    <span>Storefront</span>
                  </button>
                }
              />
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
