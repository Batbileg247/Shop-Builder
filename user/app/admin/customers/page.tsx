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
    <div className="space-y-8">
      <header className="rounded-[2rem] bg-white px-6 py-6 shadow-[0_24px_70px_rgba(15,23,42,0.07)] sm:px-8">
        <p className="text-sm font-bold text-slate-400">Customers</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950 sm:text-4xl">
          People who shop at {activeShop.name}
        </h1>
        <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-slate-500">
          Same list you would scribble in a notebook — names, emails, and what
          they have spent. Use the shop picker in the sidebar to switch stores.
        </p>
      </header>

      <section className="rounded-[2rem] bg-white p-5 shadow-[0_24px_70px_rgba(15,23,42,0.07)] sm:p-7">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold text-slate-400">Directory</p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">
              Recent orders
            </h2>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
            <input
              placeholder="Name or email"
              className="h-12 w-full rounded-2xl border border-slate-100 bg-slate-50 pl-11 pr-4 text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-300 focus:bg-white"
            />
          </div>
        </div>

        <div className="mt-6 grid gap-3">
          {customers.map((customer) => (
            <div
              key={customer.id}
              className="grid gap-4 rounded-[1.5rem] bg-slate-50 p-4 md:grid-cols-[minmax(0,1fr)_160px_160px]"
            >
              <div className="flex min-w-0 items-center gap-4">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-white">
                  <Image
                    src={customer.avatarUrl}
                    alt=""
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-black text-slate-950">
                    {customer.name}
                  </p>
                  <p className="mt-1 flex min-w-0 items-center gap-2 truncate text-sm font-semibold text-slate-400">
                    <Mail className="h-4 w-4 shrink-0" />
                    {customer.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                <ShoppingBag className="h-4 w-4 text-blue-400" />
                {customer.totalOrders} orders
              </div>
              <div className="text-sm font-black text-slate-950 md:text-right">
                {currencyFormatter.format(customer.lifetimeValue)}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
