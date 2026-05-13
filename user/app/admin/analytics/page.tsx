"use client";

import SalesChart from "@/components/SalesChart";
import { useDashboard } from "@/context/DashboardContext";
import { monthlySalesData } from "@/lib/mockData";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default function AnalyticsPage() {
  const { activeShop, activeShopId } = useDashboard();
  const timeline = monthlySalesData.filter((point) => point.shopId === activeShopId);
  const totalSales = timeline.reduce((total, point) => total + point.sales, 0);

  return (
    <div className="space-y-8">
      <header className="rounded-[2rem] bg-white px-6 py-6 shadow-[0_24px_70px_rgba(15,23,42,0.07)] sm:px-8">
        <p className="text-sm font-bold text-slate-400">Analytics</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950 sm:text-4xl">
          {activeShop.name} sales
        </h1>
        <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-slate-400">
          Monthly sales analytics for the selected tenant.
        </p>
      </header>

      <SalesChart
        activeShopId={activeShopId}
        brandColor="#14b8a6"
        className="rounded-[2rem] p-0"
      />

      <section className="rounded-[2rem] bg-white p-7 shadow-[0_24px_70px_rgba(15,23,42,0.06)]">
        <p className="text-sm font-bold text-slate-400">Annual Summary</p>
        <h2 className="mt-1 text-2xl font-black text-slate-950">
          {currencyFormatter.format(totalSales)}
        </h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {timeline.slice(-4).map((point) => (
            <div key={point.month} className="rounded-[1.5rem] bg-slate-50 p-4">
              <p className="text-sm font-bold text-slate-400">{point.month}</p>
              <p className="mt-2 text-xl font-black text-slate-950">
                {currencyFormatter.format(point.sales)}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
