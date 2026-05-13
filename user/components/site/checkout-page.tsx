"use client";

import Link from "next/link";

import { useStore } from "@/context/store-context";

import { SiteHeader } from "./site-header";

export function CheckoutPage() {
  const { basePath } = useStore();

  return (
    <div className="pv-storefront">
      <SiteHeader />
      <main className="mx-auto w-full max-w-lg flex-1 px-6 py-16 text-center">
        <h1 className="border-b border-pv-divider pb-4 text-xl font-semibold tracking-tight text-pv-fg sm:text-2xl">
          Checkout
        </h1>
        <p className="mt-8 text-sm leading-relaxed text-pv-muted">
          Таны захиалгыг хүлээн авлаа. Төлбөрийн интеграц хөгжүүлэгдэж байна.
        </p>
        <Link
          href={`${basePath}/shop`}
          className="pv-btn-ghost mt-10 inline-flex px-5 py-2.5 text-sm font-medium"
        >
          Дэлгүүр рүү буцах
        </Link>
      </main>
    </div>
  );
}

