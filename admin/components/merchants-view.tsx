"use client";

import Link from "next/link";
import * as React from "react";
import { MoreHorizontal } from "lucide-react";

import type { MerchantDisplay } from "@/lib/fetch-merchants";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const COL_GRID =
  "grid grid-cols-[minmax(0,1.6fr)_minmax(0,0.55fr)_minmax(0,0.85fr)_minmax(0,0.55fr)_44px] items-center gap-3 sm:gap-4";

function emailInitial(email: string) {
  const ch = email.trim().charAt(0);
  return ch ? ch.toUpperCase() : "?";
}

function shortId(id: string) {
  if (id.length <= 10) return `#${id}`;
  return `#${id.slice(0, 3)}...${id.slice(-3)}`;
}

function exportMerchantsCsv(merchants: MerchantDisplay[]) {
  const header = ["id", "email", "role", "status"];
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const lines = [
    header.join(","),
    ...merchants.map((m) =>
      [m.id, m.email, m.role, m.status].map(escape).join(","),
    ),
  ];
  const blob = new Blob([lines.join("\n")], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "merchants.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export function MerchantsPageSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-40 rounded-lg" />
          <Skeleton className="h-7 w-16 rounded-full" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-28 rounded-lg" />
          <Skeleton className="h-9 w-36 rounded-lg" />
        </div>
      </div>
      <div className="rounded-[20px] px-1">
        <div className={cn(COL_GRID, "mb-3 px-4 pt-1")}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full max-w-[100px] rounded-md" />
          ))}
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton
            key={i}
            className="mb-3 h-[72px] w-full rounded-[20px] shadow-sm"
          />
        ))}
      </div>
    </div>
  );
}

function MerchantRow({ merchant }: { merchant: MerchantDisplay }) {
  return (
    <div
      className={cn(
        COL_GRID,
        "mb-3 rounded-[20px] border-none bg-white p-4 shadow-sm",
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <Avatar className="size-10 shrink-0">
          <AvatarFallback className="bg-neutral-200 text-sm font-semibold text-neutral-700">
            {emailInitial(merchant.email)}
          </AvatarFallback>
        </Avatar>
        <span className="truncate text-sm font-medium text-[#111827]">
          {merchant.email}
        </span>
      </div>
      <div>
        {merchant.role === "admin" ? (
          <Badge className="rounded-full border-none bg-[#111827] px-2.5 py-0.5 text-xs font-medium text-white hover:bg-[#111827]/90">
            Admin
          </Badge>
        ) : (
          <Badge
            variant="secondary"
            className="rounded-full border-none bg-neutral-200/90 px-2.5 py-0.5 text-xs font-medium text-neutral-800 hover:bg-neutral-200"
          >
            Merchant
          </Badge>
        )}
      </div>
      <div className="min-w-0">
        <span className="truncate font-mono text-xs text-neutral-500">
          {shortId(merchant.id)}
        </span>
      </div>
      <div>
        <Badge
          variant="secondary"
          className="rounded-full border-none bg-neutral-200/90 px-2.5 py-1 text-xs font-medium text-neutral-700 shadow-none hover:bg-neutral-200/90"
        >
          {merchant.status}
        </Badge>
      </div>
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-9 shrink-0 rounded-full text-neutral-600 hover:bg-neutral-100"
              aria-label="Actions"
            >
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>View Storefront</DropdownMenuItem>
            <DropdownMenuItem>Edit Profile</DropdownMenuItem>
            <DropdownMenuItem variant="destructive">
              Suspend Account
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export function MerchantsView({
  merchants,
  fetchError,
}: {
  merchants: MerchantDisplay[];
  fetchError: null | "api";
}) {
  React.useEffect(() => {
    console.log("API Result (merchants client props):", {
      merchants,
      fetchError,
    });
  }, [merchants, fetchError]);

  if (fetchError === "api" && merchants.length === 0) {
    return (
      <div className="mx-auto flex min-h-[50vh] w-full max-w-[1200px] flex-col items-center justify-center gap-4 p-6 lg:p-8">
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

  if (merchants.length === 0) {
    return (
      <div className="mx-auto flex min-h-[50vh] w-full max-w-[1200px] flex-col items-center justify-center gap-4 p-6 lg:p-8">
        <p className="text-center text-lg font-medium text-neutral-700">
          No merchants found
        </p>
        <Button asChild className="rounded-full px-6">
          <Link href="/">Create your first merchant</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 p-6 lg:p-8">
      {fetchError === "api" && merchants.length > 0 && (
        <div
          role="alert"
          className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
        >
          Холболтын анхааруулга: зарим өгөгдөл ачаалагдаагүй байж магадгүй.
          Сүлжээ болон нууц түлхүүрээ шалгана уу.
        </div>
      )}
      <div className="mb-2 flex flex-col gap-4 sm:mb-0 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight text-[#111827] sm:text-3xl">
            Merchants
          </h1>
          <Badge
            variant="secondary"
            className="rounded-full border-none bg-white px-3 py-1 text-sm font-medium text-neutral-700 shadow-sm"
          >
            {merchants.length} total
          </Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            className="rounded-full border-neutral-200 bg-white shadow-sm"
            onClick={() => exportMerchantsCsv(merchants)}
          >
            Export CSV
          </Button>
          <Button
            type="button"
            className="rounded-full bg-[#111827] text-white hover:bg-[#111827]/90"
            asChild
          >
            <Link href="/">Add Merchant</Link>
          </Button>
        </div>
      </div>

      <div className="mt-4">
        <div
          className={cn(
            COL_GRID,
            "mb-3 px-4 text-[11px] font-semibold uppercase tracking-wide text-neutral-500",
          )}
        >
          <span>Merchant</span>
          <span>Role</span>
          <span>User ID</span>
          <span>Status</span>
          <span className="text-right">Actions</span>
        </div>

        <div>
          {merchants.map((m) => (
            <MerchantRow key={m.id} merchant={m} />
          ))}
        </div>
      </div>
    </div>
  );
}
