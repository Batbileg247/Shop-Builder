"use client";

import { Mail, Package } from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";
import type { DashboardOrderLine, Shop } from "@/types/dashboard";

function formatBill(currency: Shop["currency"], amount: number) {
  if (currency === "MNT") {
    return `${Math.round(amount).toLocaleString("en-US")} ₮`;
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "EUR" ? 2 : 0,
  }).format(amount);
}

const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

function linesLabel(lines: DashboardOrderLine[]) {
  return lines.map((l) => `${l.productName} × ${l.quantity}`).join(", ");
}

export default function AdminOrdersPage() {
  const { activeShop, orders, remoteStatus } = useDashboard();

  return (
    <div className="space-y-6 p-6">
      <header className="rounded-2xl border border-zinc-200 bg-white px-8 py-7">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
          Orders
        </p>
        <h1 className="mt-2 text-3xl font-bold text-zinc-900 sm:text-4xl">
          Timeline for {activeShop.name}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
          When each order was placed, who bought, line items, and the final
          total. Switch shops from the sidebar to see another store.
        </p>
      </header>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-7">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
            Recent activity
          </p>
          <h2 className="text-xl font-bold text-zinc-900">Order timeline</h2>
        </div>

        {orders.length === 0 ? (
          <p className="mt-8 text-sm text-zinc-500">
            {remoteStatus === "loading"
              ? "Loading orders…"
              : "No orders yet for this shop."}
          </p>
        ) : (
          <ul className="mt-8 space-y-4">
            {orders.map((order) => (
              <li key={order.id}>
                <div className="flex flex-col gap-4 rounded-2xl border border-zinc-100 bg-zinc-50/80 p-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 space-y-3">
                    <p className="text-sm font-semibold text-zinc-900">
                      {dateTimeFormatter.format(order.placedAt)}
                    </p>
                    <div>
                      <p className="font-semibold text-zinc-900">
                        {order.customerName}
                      </p>
                      <p className="mt-1 flex min-w-0 items-center gap-1.5 text-xs font-medium text-zinc-500">
                        <Mail className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{order.customerEmail}</span>
                      </p>
                    </div>
                    <div className="flex gap-2 text-sm text-zinc-600">
                      <Package
                        className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400"
                        aria-hidden
                      />
                      <p className="leading-relaxed">{linesLabel(order.lines)}</p>
                    </div>
                  </div>
                  <div className="shrink-0 text-left sm:text-right">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
                      Final bill
                    </p>
                    <p className="mt-1 text-lg font-bold tabular-nums text-zinc-900">
                      {formatBill(activeShop.currency, order.total)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
