"use client";

import Link from "next/link";
import * as React from "react";

import type { ProductDisplay } from "@/lib/fetch-products";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function formatPriceMnt(n: number) {
  return new Intl.NumberFormat("mn-MN", { maximumFractionDigits: 0 }).format(n);
}

function shortId(id: string) {
  if (id === "—" || id.length <= 12) return id;
  return `${id.slice(0, 4)}…${id.slice(-4)}`;
}

function ProductThumb({ src }: { src: string }) {
  const [broken, setBroken] = React.useState(false);
  if (!src || broken) {
    return (
      <div
        className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-[10px] font-medium text-neutral-400"
        aria-hidden
      >
        —
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      width={44}
      height={44}
      className="size-11 shrink-0 rounded-lg object-cover"
      onError={() => setBroken(true)}
    />
  );
}

export function ProductsPageSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-36 rounded-lg" />
          <Skeleton className="h-7 w-14 rounded-full" />
        </div>
        <Skeleton className="h-9 w-32 rounded-full" />
      </div>
      <Skeleton className="h-[420px] w-full rounded-[20px] shadow-sm" />
    </div>
  );
}

export function ProductsView({
  products,
  fetchError,
}: {
  products: ProductDisplay[];
  fetchError: null | "api";
}) {
  React.useEffect(() => {
    console.log("API Result (products client props):", { products, fetchError });
  }, [products, fetchError]);

  if (fetchError === "api" && products.length === 0) {
    return (
      <div className="mx-auto flex min-h-[50vh] w-full max-w-[1200px] flex-col items-center justify-center gap-4 p-6 lg:p-8">
        <p className="text-center text-lg font-semibold text-red-800">
          API Connection Error
        </p>
        <p className="max-w-md text-center text-sm text-neutral-600">
          Merchant API руу холбогдож чадсангүй.{" "}
          <code className="rounded bg-neutral-100 px-1">
            NEXT_PUBLIC_MERCHANT_API_URL
          </code>{" "}
          шалгана уу.
        </p>
        <Button asChild variant="outline" className="rounded-full">
          <Link href="/">Back to dashboard</Link>
        </Button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="mx-auto flex min-h-[50vh] w-full max-w-[1200px] flex-col items-center justify-center gap-4 p-6 lg:p-8">
        <p className="text-center text-lg font-medium text-neutral-700">
          Бараа олдсонгүй
        </p>
        <p className="max-w-md text-center text-sm text-neutral-500">
          Merchant API дээрх{" "}
          <code className="rounded bg-neutral-100 px-1 font-mono text-xs">
            GET /admin/products
          </code>{" "}
          хоосон жагсаалт буцаасан байна.
        </p>
        <Button asChild className="rounded-full bg-[#111827] px-6 text-white hover:bg-[#111827]/90">
          <Link href="/">Dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 p-6 lg:p-8">
      {fetchError === "api" && products.length > 0 && (
        <div
          role="alert"
          className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
        >
          Холболтын анхааруулга: зарим өгөгдөл ачаалагдаагүй байж магадгүй.
        </div>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight text-[#111827] sm:text-3xl">
            Products
          </h1>
          <Badge
            variant="secondary"
            className="rounded-full border-none bg-white px-3 py-1 text-sm font-medium text-neutral-700 shadow-sm"
          >
            {products.length} total
          </Badge>
        </div>
        <Button asChild variant="outline" className="w-fit rounded-full shadow-sm">
          <Link href="/stores">Stores</Link>
        </Button>
      </div>

      <div className="overflow-hidden rounded-[20px] border border-neutral-200/80 bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-14 pl-4" />
              <TableHead>Бараа</TableHead>
              <TableHead className="hidden md:table-cell">Тайлбар</TableHead>
              <TableHead>Үнэ (тоо)</TableHead>
              <TableHead className="hidden sm:table-cell">storeId</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="pl-4">
                  <ProductThumb src={p.images[0] ?? ""} />
                </TableCell>
                <TableCell className="max-w-[200px] font-medium text-[#111827]">
                  <span className="line-clamp-2">{p.name}</span>
                  <span className="mt-0.5 block font-mono text-[10px] font-normal text-neutral-400 sm:hidden">
                    {shortId(p.storeId)}
                  </span>
                </TableCell>
                <TableCell className="hidden max-w-xs text-neutral-600 md:table-cell">
                  <span className="line-clamp-2 text-sm">
                    {p.description ?? "—"}
                  </span>
                </TableCell>
                <TableCell className="tabular-nums text-neutral-800">
                  {formatPriceMnt(p.price)}
                </TableCell>
                <TableCell className="hidden font-mono text-xs text-neutral-500 sm:table-cell">
                  {shortId(p.storeId)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
