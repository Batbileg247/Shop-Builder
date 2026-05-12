"use client";

import * as React from "react";

import { useShop } from "@/app/hooks/useShop";
import { AppSidebar } from "@/components/app-sidebar";
import { formatMoney } from "@/lib/utils";
import { AdminSurface } from "@/app/components/surfaces/AdminSurface";
import { BuilderSurface } from "@/app/components/surfaces/BuilderSurface";
import { ClientSurface } from "@/app/components/surfaces/ClientSurface";
import { ScrollArea } from "@/ui/scroll-area";
import { Separator } from "@/ui/separator";
import { Metric } from "@/ui";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";

type Surface = "builder" | "admin" | "client";

export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const shop = useShop();
  const { theme, surface, setSurface } = shop;

  const totalRevenue = shop.orders.reduce((s, o) => s + o.total, 0);

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "14rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar
        setSurface={(s) => setSurface(s as Surface)}
        shopName={theme.name}
        surface={surface as Surface}
      />

      <SidebarInset>
        <main className="flex min-h-svh flex-1 flex-col">
          <div className="flex h-14 items-center gap-2 border-b border-border bg-background px-4">
            <SidebarTrigger />
            <Separator className="mx-1 h-5" orientation="vertical" />
            <p className="truncate text-base font-semibold capitalize">
              {surface}
            </p>
          </div>

          <ScrollArea className="flex-1">
            <div className="w-full px-6 py-8 sm:px-10 lg:px-14">
              {surface === "admin" && (
                <section className="mb-8 grid gap-4 sm:grid-cols-4">
                  <Metric
                    label="Products"
                    value={shop.products.length.toString()}
                  />
                  <Metric
                    label="In stock"
                    value={shop.inStockProducts.length.toString()}
                    sub={`${shop.products.length - shop.inStockProducts.length} out of stock`}
                  />
                  <Metric
                    label="Orders"
                    value={shop.orders.length.toString()}
                  />
                  <Metric
                    label="Revenue"
                    value={formatMoney(totalRevenue, theme.currency)}
                  />
                </section>
              )}

              {surface === "builder" ? (
                <BuilderSurface
                  addToCart={shop.addToCart}
                  buyerEmail={shop.buyerEmail}
                  buyerName={shop.buyerName}
                  cartItems={shop.cartItems}
                  cartTotal={shop.cartTotal}
                  checkout={shop.checkout}
                  clearCartItem={shop.clearCartItem}
                  featuredProducts={shop.featuredProducts}
                  lastOrderId={shop.lastOrderId}
                  products={shop.products}
                  removeFromCart={shop.removeFromCart}
                  setBuyerEmail={shop.setBuyerEmail}
                  setBuyerName={shop.setBuyerName}
                  theme={theme}
                  updateTheme={shop.updateTheme}
                />
              ) : surface === "admin" ? (
                <AdminSurface
                  draft={shop.draft}
                  editingId={shop.editingId}
                  onAddProduct={shop.addProduct}
                  onCancelEdit={shop.cancelEdit}
                  onDeleteProduct={shop.deleteProduct}
                  onSaveEdit={shop.saveEdit}
                  onStartEdit={shop.startEdit}
                  onToggleFeatured={shop.toggleFeatured}
                  onUpdateInventory={shop.updateInventory}
                  onUpdateOrderStatus={shop.updateOrderStatus}
                  orders={shop.orders}
                  products={shop.products}
                  setDraft={shop.setDraft}
                  theme={theme}
                />
              ) : (
                <ClientSurface
                  addToCart={shop.addToCart}
                  buyerEmail={shop.buyerEmail}
                  buyerName={shop.buyerName}
                  cartItems={shop.cartItems}
                  cartTotal={shop.cartTotal}
                  checkout={shop.checkout}
                  clearCartItem={shop.clearCartItem}
                  featuredProducts={shop.featuredProducts}
                  lastOrderId={shop.lastOrderId}
                  products={shop.products}
                  removeFromCart={shop.removeFromCart}
                  setBuyerEmail={shop.setBuyerEmail}
                  setBuyerName={shop.setBuyerName}
                  theme={theme}
                />
              )}

              {children}
            </div>
          </ScrollArea>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
