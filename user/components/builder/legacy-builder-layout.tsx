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
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

type Surface = "builder" | "admin" | "client";

function CloseSidebarOnStorefront({ surface }: { surface: Surface }) {
  const { setOpen, setOpenMobile, isMobile } = useSidebar();

  React.useEffect(() => {
    if (surface !== "client") return;
    if (isMobile) setOpenMobile(false);
    else setOpen(false);
  }, [surface, isMobile, setOpen, setOpenMobile]);

  return null;
}

/** Өмнөх `/builder` layout — одоо `/builder/panel` дээр. */
export function LegacyBuilderLayout() {
  const shop = useShop();
  const { theme, surface, setSurface } = shop;

  const totalRevenue = shop.orders.reduce((s, o) => s + o.total, 0);

  return (
    <SidebarProvider
      className="flex w-full min-h-svh flex-1 flex-row"
      style={
        {
          "--sidebar-width": "14rem",
        } as React.CSSProperties
      }
    >
      <CloseSidebarOnStorefront surface={surface as Surface} />
      <AppSidebar
        setSurface={(s) => setSurface(s as Surface)}
        shopName={theme.name}
        surface={surface as Surface}
      />

      <SidebarInset className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background px-4">
            <SidebarTrigger />
            <Separator className="mx-1 h-5" orientation="vertical" />
            <p className="truncate text-base font-semibold capitalize">
              {surface}
            </p>
          </div>

          <ScrollArea className="min-h-0 flex-1 basis-0 overflow-hidden">
            <div className="flex min-h-full w-full flex-1 flex-col px-6 py-8 sm:px-10 lg:px-14">
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
            </div>
          </ScrollArea>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
