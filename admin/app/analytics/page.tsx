import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchAdminStats } from "@/lib/fetch-admin-stats";

export const dynamic = "force-dynamic";

function formatInt(n: number) {
  return new Intl.NumberFormat("mn-MN", { maximumFractionDigits: 0 }).format(n);
}

export default async function AnalyticsPage() {
  const { stats, error } = await fetchAdminStats();
  const ok = error === null && stats !== null;

  return (
    <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-8 p-6 lg:p-8">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-neutral-400">
          Analytics
        </p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#111827]">
          Платформын тойм
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-neutral-600">
          Merchant API-ийн{" "}
          <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-xs">
            GET /admin/stats
          </code>{" "}
          endpoint-оос (backend-book.md).
        </p>
      </div>

      {error === "api" && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900"
        >
          Merchant API руу холбогдож чадсангүй —{" "}
          <code className="rounded bg-red-100/80 px-1">
            NEXT_PUBLIC_MERCHANT_API_URL
          </code>{" "}
          болон сүлжээг шалгана уу.
        </div>
      )}

      {error === "no_data" && (
        <div
          role="status"
          className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
        >
          Статистикийн хариу ирсэн ч тоо уншихад тохирохгүй байна.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="rounded-[20px] border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-neutral-500">
              Нийт merchant
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold tabular-nums text-[#111827]">
              {ok ? formatInt(stats!.totalMerchants) : "—"}
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-[20px] border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-neutral-500">
              Нийт дэлгүүр
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold tabular-nums text-[#111827]">
              {ok ? formatInt(stats!.totalStores) : "—"}
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-[20px] border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-neutral-500">
              Нийт бараа
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold tabular-nums text-[#111827]">
              {ok ? formatInt(stats!.totalProducts) : "—"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button asChild variant="outline" className="rounded-full">
          <Link href="/merchants">Merchants</Link>
        </Button>
        <Button asChild variant="outline" className="rounded-full">
          <Link href="/stores">Stores</Link>
        </Button>
        <Button asChild variant="outline" className="rounded-full">
          <Link href="/products">Products</Link>
        </Button>
        <Button asChild className="rounded-full bg-[#111827] text-white hover:bg-[#111827]/90">
          <Link href="/">Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
