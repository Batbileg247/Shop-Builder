"use client";

import { useShop } from "@/hooks/useShop";

import { formatMoney } from "@/lib/utils";
import { BuilderSurface } from "../components/surfaces/BuilderSurface";
import { AdminSurface } from "../components/surfaces/AdminSurface";
import { ClientSurface } from "../components/surfaces/ClientSurface";
import { Metric } from "@/components/ui";

const SURFACES = ["builder", "admin", "client"] as const;

const Builder = () => {
  const shop = useShop();
  const { theme, surface, setSurface } = shop;

  const totalRevenue = shop.orders.reduce((s, o) => s + o.total, 0);

  return (
    <main
      className="min-h-screen px-4 py-5 text-zinc-950 sm:px-6 lg:px-8"
      style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
        {/* Header */}
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-black/10 pb-4">
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: theme.primaryColor }}
            >
              Shop builder
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
              {theme.name}
            </h1>
          </div>

          <nav className="flex rounded-lg border border-black/10 bg-white p-1 shadow-sm">
            {SURFACES.map((item) => (
              <button
                className="rounded-md px-4 py-2 text-sm font-medium capitalize transition"
                key={item}
                onClick={() => setSurface(item)}
                style={
                  surface === item
                    ? { backgroundColor: theme.primaryColor, color: "#fff" }
                    : { color: "#52525b" }
                }
                type="button"
              >
                {item}
              </button>
            ))}
          </nav>
        </header>

        {/* Metrics */}
        <section className="grid gap-3 sm:grid-cols-4">
          <Metric label="Products" value={shop.products.length.toString()} />
          <Metric
            label="In stock"
            value={shop.inStockProducts.length.toString()}
            sub={`${shop.products.length - shop.inStockProducts.length} out of stock`}
          />
          <Metric label="Orders" value={shop.orders.length.toString()} />
          <Metric
            label="Revenue"
            value={formatMoney(totalRevenue, theme.currency)}
          />
        </section>

        {/* Surfaces */}
        {surface === "builder" && (
          <BuilderSurface
            featuredProducts={shop.featuredProducts}
            theme={theme}
            updateTheme={shop.updateTheme}
          />
        )}

        {surface === "admin" && (
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
        )}

        {surface === "client" && (
          <ClientSurface
            addToCart={shop.addToCart}
            buyerEmail={shop.buyerEmail}
            buyerName={shop.buyerName}
            cartItems={shop.cartItems}
            cartTotal={shop.cartTotal}
            checkout={shop.checkout}
            clearCartItem={shop.clearCartItem}
            lastOrderId={shop.lastOrderId}
            products={shop.products}
            removeFromCart={shop.removeFromCart}
            setBuyerEmail={shop.setBuyerEmail}
            setBuyerName={shop.setBuyerName}
            theme={theme}
          />
        )}
      </div>
    </main>
  );
};

export default Builder;
