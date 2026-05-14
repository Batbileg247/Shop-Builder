"use client";

import * as React from "react";
import {
  ArrowUpRight,
  CalendarDays,
  DollarSign,
  LineChart,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import SalesChart from "@/components/SalesChart";
import { useDashboard } from "@/context/DashboardContext";
import { monthlySalesData } from "@/lib/mockData";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("en-US");

function compactCurrency(value: number) {
  if (value >= 1000) {
    return `$${Math.round(value / 1000)}k`;
  }

  return currencyFormatter.format(value);
}

export default function OverviewPage() {
  const { activeShop, activeShopId, metrics, products } = useDashboard();

  const timeline = React.useMemo(
    () => monthlySalesData.filter((point) => point.shopId === activeShopId),
    [activeShopId],
  );

  const totalTimelineSales = timeline.reduce(
    (total, point) => total + point.sales,
    0,
  );
  const averageMonthlySales = timeline.length
    ? Math.round(totalTimelineSales / timeline.length)
    : 0;
  const bestMonth = timeline.reduce(
    (best, point) => (point.sales > best.sales ? point : best),
    timeline[0] ?? { month: "-", sales: 0, shopId: activeShopId },
  );
  const firstMonthSales = timeline[0]?.sales ?? 0;
  const lastMonthSales = timeline[timeline.length - 1]?.sales ?? 0;
  const growth =
    firstMonthSales > 0
      ? Math.round(((lastMonthSales - firstMonthSales) / firstMonthSales) * 100)
      : 0;
  const maxSales = Math.max(...timeline.map((point) => point.sales), 1);

  const overviewCards = [
    {
      label: "Yearly Sales",
      value: currencyFormatter.format(totalTimelineSales),
      caption: `${growth >= 0 ? "+" : ""}${growth}% since January`,
      icon: TrendingUp,
      iconClass: "bg-teal-100 text-teal-500",
    },
    {
      label: "Best Month",
      value: bestMonth.month,
      caption: currencyFormatter.format(bestMonth.sales),
      icon: CalendarDays,
      iconClass: "bg-purple-100 text-purple-500",
    },
    {
      label: "Avg. Monthly",
      value: currencyFormatter.format(averageMonthlySales),
      caption: "Averaged across the months below",
      icon: LineChart,
      iconClass: "bg-blue-100 text-blue-500",
    },
    {
      label: "Catalog total",
      value: currencyFormatter.format(metrics.revenue),
      caption: `${numberFormatter.format(products.length)} products you added here`,
      icon: ShoppingBag,
      iconClass: "bg-orange-100 text-orange-500",
    },
  ];

  return (
    <div className="space-y-8">
      <header className="rounded-[2rem] bg-white px-6 py-6 shadow-[0_24px_70px_rgba(15,23,42,0.07)] sm:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-bold text-slate-400">Overview</p>
            <h1 className="mt-2 text-3xl font-black text-slate-950 sm:text-4xl">
              {activeShop.name}
            </h1>
            <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-slate-500">
              How {activeShop.name} did this year — totals and a month-by-month
              chart so you can spot the busy stretches.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3">
            <DollarSign className="h-5 w-5 text-teal-500" />
            <span className="text-sm font-black text-slate-950">
              {currencyFormatter.format(lastMonthSales)} in December
            </span>
          </div>
        </div>
      </header>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {overviewCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className="rounded-[2rem] bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.06)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-slate-400">
                    {card.label}
                  </p>
                  <p className="mt-3 text-2xl font-black text-slate-950">
                    {card.value}
                  </p>
                  <p className="mt-2 flex items-center gap-1 text-xs font-bold text-slate-400">
                    <ArrowUpRight className="h-3.5 w-3.5 text-teal-500" />
                    {card.caption}
                  </p>
                </div>
                <div
                  className={`flex h-13 w-13 items-center justify-center rounded-2xl ${card.iconClass}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <SalesChart
          activeShopId={activeShopId}
          brandColor="#14b8a6"
          className="rounded-[2rem] p-0"
        />

        <div className="rounded-[2rem] bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.06)]">
          <p className="text-sm font-bold text-slate-400">Month by month</p>
          <h2 className="mt-1 text-2xl font-black text-slate-950">
            January to December
          </h2>
          <div className="mt-6 space-y-4">
            {timeline.map((point) => (
              <div key={point.month} className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-black text-slate-950">
                    {point.month}
                  </p>
                  <p className="text-sm font-bold text-slate-400">
                    {compactCurrency(point.sales)}
                  </p>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-teal-400"
                    style={{ width: `${(point.sales / maxSales) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
