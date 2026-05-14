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

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("en-US");

function compactCurrency(value: number) {
  if (value >= 1000) return `$${Math.round(value / 1000)}k`;
  return currencyFormatter.format(value);
}

export default function OverviewPage() {
  const { activeShop, activeShopId, monthlySales } = useDashboard();

  const timeline = React.useMemo(
    () => monthlySales.filter((point) => point.shopId === activeShopId),
    [activeShopId, monthlySales],
  );

  const totalTimelineSales = timeline.reduce((t, p) => t + p.sales, 0);
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
  const maxSales = Math.max(...timeline.map((p) => p.sales), 1);

  const overviewCards = [
    {
      label: "Yearly Sales",
      value: currencyFormatter.format(totalTimelineSales),
      caption: `${growth >= 0 ? "+" : ""}${growth}% since January`,
      icon: TrendingUp,
    },
    {
      label: "Best Month",
      value: bestMonth.month,
      caption: currencyFormatter.format(bestMonth.sales),
      icon: CalendarDays,
    },
    {
      label: "Avg. Monthly",
      value: currencyFormatter.format(averageMonthlySales),
      caption: "Averaged across all months",
      icon: LineChart,
    },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* ── Header ── */}
      <header className="rounded-2xl border border-zinc-200 bg-white px-8 py-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
              Overview
            </p>
            <h1 className="mt-2 text-3xl font-bold text-zinc-900 sm:text-4xl">
              {activeShop.name}
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-500">
              How {activeShop.name} performed this year — totals and a
              month-by-month breakdown to spot your busiest stretches.
            </p>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl border border-zinc-200 bg-zinc-50 px-5 py-3.5">
            <DollarSign className="h-4.5 w-4.5 text-zinc-400" />
            <span className="text-sm font-bold text-zinc-900">
              {currencyFormatter.format(lastMonthSales)}{" "}
              <span className="font-medium text-zinc-400">in December</span>
            </span>
          </div>
        </div>
      </header>

      {/* ── Stat cards ── */}
      <section className="grid gap-4 xl:grid-cols-3">
        {overviewCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-2xl border border-zinc-200 bg-white p-6 transition-shadow hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
                    {card.label}
                  </p>
                  <p className="mt-3 truncate text-2xl font-bold text-zinc-900">
                    {card.value}
                  </p>
                  <p className="mt-2 flex items-center gap-1 text-xs font-medium text-zinc-400">
                    <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-zinc-900" />
                    {card.caption}
                  </p>
                </div>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-zinc-100 bg-zinc-50">
                  <Icon className="h-4.5 w-4.5 text-zinc-400" />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* ── Chart + breakdown ── */}
      <section className=" ">
        {/* Sales chart */}
        <div className="rounded-2xl border border-zinc-200 bg-white">
          <SalesChart
            activeShopId={activeShopId}
            data={monthlySales}
            brandColor="#18181b"
            className="rounded-2xl p-0"
          />
        </div>
      </section>
    </div>
  );
}
