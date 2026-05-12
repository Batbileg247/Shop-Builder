"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Metric } from "@/ui"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { LayoutPanelTopIcon, ShieldIcon, ShoppingBagIcon } from "lucide-react"

type Surface = "builder" | "admin" | "client"

export function AppSidebar({
  surface,
  setSurface,
  shopName,
  accentColor,
  productsCount,
  inStockCount,
  className,
}: {
  surface: Surface
  setSurface: (surface: Surface) => void
  shopName: string
  accentColor: string
  productsCount: number
  inStockCount: number
  className?: string
}) {
  return (
    <Sidebar collapsible="icon" variant="inset" className={className}>
      <SidebarHeader className="gap-2">
        <div className="px-1">
          <p
            className="truncate text-xs font-semibold uppercase tracking-wider"
            style={{ color: accentColor }}
          >
            Shop builder
          </p>
          <p className="truncate text-sm font-semibold text-sidebar-foreground">
            {shopName}
          </p>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <div className="p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={surface === "builder"}
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

          <div className={cn("mt-3 grid gap-2")}>
            <Metric label="Products" value={productsCount.toString()} />
            <Metric
              label="In stock"
              value={inStockCount.toString()}
              sub={`${productsCount - inStockCount} out of stock`}
            />
          </div>
        </div>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  )
}

