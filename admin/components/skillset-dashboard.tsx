"use client";

import * as React from "react";

import type { AdminStatsFetchResult } from "@/lib/fetch-admin-stats";

function formatInt(n: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(
    n,
  );
}

function StatCard({
  title,
  value,
  delta,
}: {
  title: string;
  value: string;
  delta: string;
}) {
  return (
    <div className="rounded-[24px] border-none bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-neutral-500">{title}</p>
      <p className="mt-1 text-3xl font-semibold tracking-tight text-[#111827] tabular-nums">
        {value}
      </p>
      <p
        className={
          delta === "—"
            ? "mt-2 text-xs font-medium text-neutral-500"
            : "mt-2 text-xs font-medium text-emerald-600"
        }
      >
        {delta}
      </p>
    </div>
  );
}

export function SkillsetDashboard({
  result,
}: {
  result: AdminStatsFetchResult;
}) {
  React.useEffect(() => {
    console.log("API Result (dashboard client props):", result);
  }, [result]);

  const ok = result.error === null && result.stats !== null;
  const s = result.stats;
  const avgSkus =
    ok && s && s.totalStores > 0
      ? Math.round(s.totalProducts / s.totalStores)
      : null;

  const statValue = (n: number | null | undefined) =>
    ok && n !== null && n !== undefined ? formatInt(n) : "—";

  const deltaOk = ok ? "+1.7% from last month" : "—";
  const deltaStores = ok ? "+2.1% from last month" : "—";
  const deltaProducts = ok ? "+0.9% from last month" : "—";
  const deltaSkus = ok ? "+0.4% from last month" : "—";

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 p-6 lg:p-8">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-neutral-400">
          Skillset
        </p>
        <p className="mt-1 text-sm text-neutral-500">
          Soft UI — платформын тойм.
        </p>
      </div>

      {result.error === "api" && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900"
        >
          <strong className="font-semibold">API Connection Error</strong>
          <span className="text-red-800">
            {" "}
            — Merchant API руу холбогдож чадсангүй. URL (NEXT_PUBLIC_MERCHANT_API_URL)
            шалгана уу.
          </span>
        </div>
      )}

      {result.error === "no_data" && (
        <div
          role="status"
          className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
        >
          <strong className="font-semibold">No Data</strong>
          <span className="text-amber-900">
            {" "}
            — /admin/stats хариу ирсэн ч тоо татахад тохирохгүй байна (бүтэц
            эсвэл хоосон).
          </span>
        </div>
      )}

      {!ok && result.error !== "api" && result.error !== "no_data" && (
        <p className="text-center text-xs text-neutral-500">
          Өгөгдөл ачаалагдаагүй байна
        </p>
      )}

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Active Merchants"
          value={statValue(s?.totalMerchants)}
          delta={deltaOk}
        />
        <StatCard
          title="Active Stores"
          value={statValue(s?.totalStores)}
          delta={deltaStores}
        />
        <StatCard
          title="Catalog Products"
          value={statValue(s?.totalProducts)}
          delta={deltaProducts}
        />
        <StatCard
          title="Avg. SKUs per store"
          value={avgSkus !== null ? formatInt(avgSkus) : "—"}
          delta={deltaSkus}
        />
      </div>
    </div>
  );
}
