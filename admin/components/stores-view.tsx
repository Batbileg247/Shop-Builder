"use client";

import Link from "next/link";
import * as React from "react";

import type { StoreDisplay } from "@/lib/fetch-stores";
import { getStorePrimaryColor } from "@/lib/fetch-stores";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

function shortOwnerId(id: string) {
  if (id === "—" || id.length <= 10) return id;
  return `#${id.slice(0, 3)}...${id.slice(-3)}`;
}

function themeConfigEntries(themeConfig: unknown): [string, string][] {
  if (!themeConfig || typeof themeConfig !== "object") return [];
  const flat: [string, string][] = [];
  const walk = (prefix: string, val: unknown) => {
    if (val === null || val === undefined) {
      flat.push([prefix, "—"]);
      return;
    }
    if (typeof val === "object" && !Array.isArray(val)) {
      for (const [k, v] of Object.entries(val as Record<string, unknown>)) {
        walk(prefix ? `${prefix}.${k}` : k, v);
      }
      return;
    }
    if (typeof val === "string" || typeof val === "number" || typeof val === "boolean") {
      flat.push([prefix, String(val)]);
      return;
    }
    try {
      flat.push([prefix, JSON.stringify(val)]);
    } catch {
      flat.push([prefix, "…"]);
    }
  };
  walk("", themeConfig);
  return flat;
}

export function StoresPageSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[1400px] p-6 lg:p-8">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-32 rounded-lg" />
          <Skeleton className="h-7 w-14 rounded-full" />
        </div>
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center lg:max-w-md">
          <Skeleton className="h-10 flex-1 rounded-full" />
          <Skeleton className="h-10 w-full rounded-full sm:w-36" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-[200px] w-full rounded-[24px] shadow-sm"
          />
        ))}
      </div>
    </div>
  );
}

function StoreDetailDialog({
  store,
  open,
  onOpenChange,
}: {
  store: StoreDisplay | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const themeRows = store ? themeConfigEntries(store.themeConfig) : [];
  const themeJson = store
    ? JSON.stringify(store.themeConfig ?? {}, null, 2)
    : "";
  const fullJson = store ? JSON.stringify(store.detail, null, 2) : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-2xl gap-0 overflow-hidden p-0 sm:rounded-2xl">
        <div className="max-h-[85vh] overflow-y-auto p-6">
          <DialogHeader>
            <DialogTitle className="text-xl text-[#111827]">
              {store?.name ?? "Store"}
            </DialogTitle>
            <DialogDescription className="text-neutral-500">
              {store ? `/s/${store.slug}` : ""}
            </DialogDescription>
          </DialogHeader>

          {store && (
            <div className="mt-6 space-y-6">
              <section>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  themeConfig (жагсаалт)
                </h3>
                {themeRows.length > 0 ? (
                  <dl className="grid gap-2 rounded-xl border border-neutral-200/80 bg-neutral-50/80 p-3 text-sm">
                    {themeRows.map(([k, v]) => (
                      <div
                        key={k}
                        className="flex flex-col gap-0.5 sm:flex-row sm:gap-3"
                      >
                        <dt className="shrink-0 font-mono text-xs text-neutral-500">
                          {k}
                        </dt>
                        <dd className="min-w-0 break-all font-medium text-[#111827]">
                          {v}
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : (
                  <p className="text-sm text-neutral-500">themeConfig хоосон.</p>
                )}
              </section>

              <section>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  themeConfig (JSON)
                </h3>
                <pre className="max-h-48 overflow-auto rounded-xl border border-neutral-200/80 bg-white p-3 font-mono text-xs leading-relaxed text-neutral-800">
                  {themeJson}
                </pre>
              </section>

              <section>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Бүх дэлгэрэнгүй (JSON)
                </h3>
                <pre className="max-h-56 overflow-auto rounded-xl border border-neutral-200/80 bg-neutral-50 p-3 font-mono text-xs leading-relaxed text-neutral-800">
                  {fullJson}
                </pre>
              </section>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function StoresView({
  stores,
  fetchError,
}: {
  stores: StoreDisplay[];
  fetchError: null | "api";
}) {
  const [query, setQuery] = React.useState("");
  const [selected, setSelected] = React.useState<StoreDisplay | null>(null);

  React.useEffect(() => {
    console.log("API Result (stores client props):", { stores, fetchError });
  }, [stores, fetchError]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return stores;
    return stores.filter(
      (s) =>
        s.name.toLowerCase().includes(q) || s.slug.toLowerCase().includes(q),
    );
  }, [stores, query]);

  if (fetchError === "api" && stores.length === 0) {
    return (
      <div className="mx-auto flex min-h-[50vh] w-full max-w-[1400px] flex-col items-center justify-center gap-4 p-6 lg:p-8">
        <p className="text-center text-lg font-semibold text-red-800">
          API Connection Error
        </p>
        <p className="max-w-md text-center text-sm text-neutral-600">
          Platform API руу холбогдож чадсангүй.{" "}
          <code className="rounded bg-neutral-100 px-1">
            NEXT_PUBLIC_PLATFORM_API_URL
          </code>{" "}
          шалгана уу.
        </p>
        <Button asChild variant="outline" className="rounded-full">
          <Link href="/">Back to dashboard</Link>
        </Button>
      </div>
    );
  }

  if (stores.length === 0) {
    return (
      <div className="mx-auto flex min-h-[50vh] w-full max-w-[1400px] flex-col items-center justify-center gap-4 p-6 lg:p-8">
        <p className="text-center text-lg font-medium text-neutral-700">
          No stores found
        </p>
        <Button asChild className="rounded-full bg-[#111827] px-6 text-white hover:bg-[#111827]/90">
          <Link href="/">Create Store</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1400px] p-6 lg:p-8">
      {fetchError === "api" && stores.length > 0 && (
        <div
          role="alert"
          className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
        >
          Холболтын анхааруулга: зарим өгөгдөл ачаалагдаагүй байж магадгүй.
        </div>
      )}
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight text-[#111827] sm:text-3xl">
            Stores
          </h1>
          <Badge
            variant="secondary"
            className="rounded-full border-none bg-white px-3 py-1 text-sm font-medium text-neutral-700 shadow-sm"
          >
            {stores.length} total
          </Badge>
        </div>
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center lg:max-w-xl">
          <Input
            type="search"
            placeholder="Search by name or slug"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-10 flex-1 rounded-full border-neutral-200/90 bg-white shadow-sm"
          />
          <Button
            asChild
            className="h-10 shrink-0 rounded-full bg-[#111827] px-5 text-white hover:bg-[#111827]/90"
          >
            <Link href="/">Create Store</Link>
          </Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-sm text-neutral-600">
          Хайлтанд тохирох дэлгүүр олдсонгүй.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((store) => {
            const primary = getStorePrimaryColor(store.themeConfig);
            return (
              <button
                key={store.id}
                type="button"
                onClick={() => setSelected(store)}
                className={cn(
                  "rounded-[24px] border-none bg-white p-6 text-left shadow-sm transition-shadow",
                  "hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111827]/25",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h2 className="truncate text-lg font-semibold text-[#111827]">
                      {store.name}
                    </h2>
                    <p className="mt-1 truncate font-mono text-sm text-neutral-500">
                      /s/{store.slug}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <span
                      className="size-8 shrink-0 rounded-full border border-neutral-200/80 shadow-inner"
                      style={{ backgroundColor: primary }}
                      title={primary}
                      aria-hidden
                    />
                    <span className="font-mono text-[10px] font-medium uppercase tracking-wide text-neutral-500">
                      {primary}
                    </span>
                  </div>
                </div>
                <p className="mt-4 text-xs text-neutral-500">
                  Owner{" "}
                  <span className="font-mono text-neutral-700">
                    {shortOwnerId(store.ownerId)}
                  </span>
                </p>
              </button>
            );
          })}
        </div>
      )}

      <StoreDetailDialog
        store={selected}
        open={!!selected}
        onOpenChange={(o) => {
          if (!o) setSelected(null);
        }}
      />
    </div>
  );
}
