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
  if (value >= 1000) {
    return `$${Math.round(value / 1000)}k`;
  }

  return salesFormatter.format(value);
}

function SalesTooltip({ active, label, payload }: TooltipContentProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const value = payload[0]?.value ?? 0;

  return (
    <div className="rounded-2xl border border-slate-100 bg-white/95 px-4 py-3 shadow-[0_18px_45px_rgba(15,23,42,0.12)] backdrop-blur">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-lg font-black text-slate-950">
        {salesFormatter.format(Number(value))}
      </p>
      <p className="mt-1 text-xs font-semibold text-slate-400">
        Monthly sales
      </p>
    </div>
  );
}

export function SalesChart({
  activeShopId,
  brandColor = "#14b8a6",
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
    <section className={`bg-slate-50 p-4 sm:p-6 ${className}`}>
      <div className="rounded-[2rem] bg-white p-5 shadow-[0_24px_70px_rgba(15,23,42,0.07)] sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-bold text-slate-400">Sales Analytic</p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">
              Monthly revenue
            </h2>
          </div>
          <div className="rounded-2xl px-4 py-3" style={{ backgroundColor: `${brandColor}14` }}>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
              Jan-Dec
            </p>
            <p className="mt-1 text-xl font-black text-slate-950">
              {salesFormatter.format(totalSales)}
            </p>
          </div>
        </div>

        <div className="mt-7 h-[320px]">
          {isMounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 12, right: 10, left: -18, bottom: 0 }}
              >
                <defs>
                  <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={brandColor}
                      stopOpacity={0.28}
                    />
                    <stop
                      offset="55%"
                      stopColor={brandColor}
                      stopOpacity={0.08}
                    />
                    <stop offset="100%" stopColor={brandColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  stroke="#e2e8f0"
                  strokeDasharray="4 8"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tickMargin={14}
                  tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 700 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tickMargin={12}
                  tickFormatter={formatCompactSales}
                  tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 700 }}
                />
                <Tooltip
                  cursor={{
                    stroke: brandColor,
                    strokeOpacity: 0.18,
                    strokeWidth: 2,
                  }}
                  content={(props) => <SalesTooltip {...props} />}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke={brandColor}
                  strokeWidth={4}
                  fill={`url(#${gradientId})`}
                  activeDot={{
                    r: 6,
                    fill: "#ffffff",
                    stroke: brandColor,
                    strokeWidth: 4,
                  }}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full rounded-[1.5rem] bg-slate-50" />
          )}
        </div>
      </div>
    </section>
  );
}

export default SalesChart;
