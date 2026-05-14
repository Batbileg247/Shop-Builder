"use client";

import Image from "next/image";
import { Mail, Search, ShoppingBag } from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default function CustomersPage() {
  const { activeShop, customers } = useDashboard();

  return (
    <div className="space-y-6 p-6">
      {/* ── Header ── */}
      <header className="rounded-2xl border border-zinc-200 bg-white px-8 py-7">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
          Customers
        </p>
        <h1 className="mt-2 text-3xl font-bold text-zinc-900 sm:text-4xl">
          People who shop at {activeShop.name}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
          Names, emails, and what they've spent. Use the shop picker in the
          sidebar to switch stores.
        </p>
      </header>

      {/* ── Directory ── */}
      <section className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-7">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
              Directory
            </p>
            <h2 className="mt-1.5 text-xl font-bold text-zinc-900">
              Recent orders
            </h2>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-72">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-300" />
            <input
              placeholder="Name or email"
              className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-11 pr-4 text-sm font-semibold text-zinc-900 outline-none placeholder:text-zinc-300 transition focus:border-zinc-900 focus:bg-white focus:ring-2 focus:ring-zinc-900/10"
            />
          </div>
        </div>

        {/* Table header */}
        <div className="mt-6 hidden grid-cols-[minmax(0,1fr)_140px_140px] gap-4 px-4 md:grid">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
            Customer
          </p>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
            Orders
          </p>
          <p className="text-right text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
            Lifetime value
          </p>
        </div>

        {/* Rows */}
        <div className="mt-2 space-y-1.5">
          {customers.map((customer) => (
            <div
              key={customer.id}
              className="grid gap-4 rounded-xl border border-transparent px-4 py-3.5 transition hover:border-zinc-200 hover:bg-zinc-50 md:grid-cols-[minmax(0,1fr)_140px_140px]"
            >
              {/* Avatar + name */}
              <div className="flex min-w-0 items-center gap-4">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-zinc-100 bg-zinc-50">
                  <Image
                    src={customer.avatarUrl}
                    alt=""
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-zinc-900">
                    {customer.name}
                  </p>
                  <p className="mt-0.5 flex min-w-0 items-center gap-1.5 truncate text-xs font-medium text-zinc-400">
                    <Mail className="h-3.5 w-3.5 shrink-0" />
                    {customer.email}
                  </p>
                </div>
              </div>

              {/* Orders */}
              <div className="flex items-center gap-2 text-sm font-medium text-zinc-500">
                <ShoppingBag className="h-4 w-4 text-zinc-300" />
                {customer.totalOrders} orders
              </div>

              {/* Value */}
              <div className="flex items-center text-sm font-bold text-zinc-900 md:justify-end">
                {currencyFormatter.format(customer.lifetimeValue)}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
