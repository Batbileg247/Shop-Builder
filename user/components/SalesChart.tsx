"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from "recharts";
import { monthlySalesData } from "@/lib/mockData";

const salesFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function formatCompactSales(value: number) {
  if (value >= 1000) return `$${Math.round(value / 1000)}k`;
  return salesFormatter.format(value);
}

function SalesTooltip({ active, label, payload }: TooltipContentProps) {
  if (!active || !payload?.length) return null;
  const value = payload[0]?.value ?? 0;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-sm">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
        {label}
      </p>
      <p className="mt-1 text-lg font-bold text-zinc-900">
        {salesFormatter.format(Number(value))}
      </p>
      <p className="mt-0.5 text-xs font-medium text-zinc-400">Monthly sales</p>
    </div>
  );
}

export function SalesChart({
  activeShopId,
  brandColor = "#18181b",
  className = "",
}: {
  activeShopId: string;
  brandColor?: string;
  className?: string;
}) {
  const gradientId = React.useId().replace(/:/g, "");
  const [isMounted, setIsMounted] = React.useState(false);

  const chartData = React.useMemo(
    () => monthlySalesData.filter((point) => point.shopId === activeShopId),
    [activeShopId],
  );

  const totalSales = React.useMemo(
    () => chartData.reduce((total, point) => total + point.sales, 0),
    [chartData],
  );

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section className={`bg-white p-6 sm:p-7 ${className}`}>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
            Sales Analytics
          </p>
          <h2 className="mt-1.5 text-xl font-bold text-zinc-900">
            Monthly Revenue
          </h2>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-5 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
            Jan – Dec
          </p>
          <p className="mt-1 text-xl font-bold text-zinc-900">
            {salesFormatter.format(totalSales)}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="mt-7 h-[320px]">
        {isMounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 12, right: 10, left: -18, bottom: 0 }}
            >
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#18181b" stopOpacity={0.12} />
                  <stop offset="60%" stopColor="#18181b" stopOpacity={0.04} />
                  <stop offset="100%" stopColor="#18181b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                stroke="#e4e4e7"
                strokeDasharray="4 8"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tickMargin={14}
                tick={{ fill: "#a1a1aa", fontSize: 12, fontWeight: 600 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tickMargin={12}
                tickFormatter={formatCompactSales}
                tick={{ fill: "#a1a1aa", fontSize: 12, fontWeight: 600 }}
              />
              <Tooltip
                cursor={{
                  stroke: "#18181b",
                  strokeOpacity: 0.1,
                  strokeWidth: 2,
                }}
                content={(props) => <SalesTooltip {...props} />}
              />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#18181b"
                strokeWidth={2}
                fill={`url(#${gradientId})`}
                activeDot={{
                  r: 5,
                  fill: "#ffffff",
                  stroke: "#18181b",
                  strokeWidth: 2,
                }}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full rounded-xl bg-zinc-50" />
        )}
      </div>
    </section>
  );
}

export default SalesChart;
