"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { BUILDER_PREVIEW_BASE } from "@/lib/site-paths";
import { formatMnt } from "@/lib/site-mock-products";
import {
  selectCartSubtotal,
  useCartStore,
} from "@/stores/cart-store";
import { cn } from "@/lib/utils";

import { SiteHeader } from "./site-header";

const base = BUILDER_PREVIEW_BASE;

export function SiteCartPage() {
  const router = useRouter();
  const lines = useCartStore((s) => s.lines);
  const removeLine = useCartStore((s) => s.removeLine);
  const setLineQuantity = useCartStore((s) => s.setLineQuantity);
  const clear = useCartStore((s) => s.clear);
  const subtotal = useCartStore(selectCartSubtotal);

  function handleCheckout() {
    if (lines.length === 0) return;
    clear();
    router.push(`${base}/checkout`);
  }

  return (
    <div className="pv-storefront">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-10 sm:py-12">
        <div className="border-b border-pv-divider pb-4">
          <h1 className="text-2xl font-semibold tracking-tight text-pv-fg sm:text-3xl">
            Cart
          </h1>
          <p className="mt-1 text-sm text-pv-muted">
            {lines.length === 0
              ? "Сагс хоосон."
              : `${lines.reduce((n, l) => n + l.quantity, 0)} ширхэг бараа`}
          </p>
        </div>

        {lines.length === 0 ? (
          <div className="mt-10 space-y-4">
            <p className="text-sm leading-relaxed text-pv-muted">
              Таны сагс одоогоор хоосон байна.
            </p>
            <Link
              href={`${base}/shop`}
              className="pv-btn-ghost inline-flex px-4 py-2 text-sm font-medium"
            >
              Дэлгүүр рүү
            </Link>
          </div>
        ) : (
          <>
            <ul className="mt-8 flex flex-col gap-4">
              {lines.map((line) => (
                <li
                  key={line.lineId}
                  className={cn(
                    "pv-card flex flex-col gap-4 p-[length:var(--pv-card-content-pad,1rem)] sm:flex-row sm:items-center sm:justify-between",
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium tracking-tight text-pv-fg">
                      {line.name}
                    </p>
                    <p className="mt-1 text-xs text-pv-muted">
                      {line.size} · {line.color}
                    </p>
                    <p className="mt-2 text-sm font-semibold tabular-nums text-pv-fg">
                      {formatMnt(line.price)} ₮ / ширхэг
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3 sm:gap-4">
                    <div className="pv-stepper">
                      <button
                        type="button"
                        aria-label="Багасгах"
                        className="px-3 py-2 text-sm text-pv-muted"
                        onClick={() =>
                          setLineQuantity(line.lineId, line.quantity - 1)
                        }
                      >
                        −
                      </button>
                      <span className="min-w-8 border-x border-pv-divider px-2 py-2 text-center text-sm tabular-nums text-pv-fg">
                        {line.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label="Нэмэх"
                        className="px-3 py-2 text-sm text-pv-muted"
                        onClick={() =>
                          setLineQuantity(line.lineId, line.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      className="text-xs font-medium text-pv-muted underline-offset-2 hover:text-pv-link-hover hover:underline"
                      onClick={() => removeLine(line.lineId)}
                    >
                      Хасах
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-10 space-y-4 border-t border-pv-divider pt-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-pv-muted">Нийт дүн</span>
                <span className="text-lg font-semibold tabular-nums tracking-tight text-pv-fg">
                  {formatMnt(subtotal)} ₮
                </span>
              </div>
              <button
                type="button"
                onClick={handleCheckout}
                className="pv-btn-primary w-full py-3 text-sm font-semibold tracking-tight"
              >
                Checkout
              </button>
              <Link
                href={`${base}/shop`}
                className="block text-center text-sm text-pv-muted underline-offset-2 hover:text-pv-link-hover hover:underline"
              >
                Дэлгүүр үргэлжлүүлэх
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
