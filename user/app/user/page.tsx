"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Home,
  LayoutDashboard,
  LogOut,
  Mail,
  Phone,
  ShieldCheck,
  Store,
  UserRound,
  Copy,
} from "lucide-react";

import {
  clearAuthSession,
  getAuthSession,
  type AuthSession,
} from "@/lib/auth-session";
import { fetchAdminStores } from "@/lib/admin-api";
import type { Shop } from "@/types/dashboard";
import { cn, safeImage } from "@/lib/utils";
import { buttonVariants } from "@/ui/button";
import { PATHS } from "@/lib/site-paths";

function displayName(session: AuthSession) {
  return [session.user.lastName, session.user.firstName]
    .filter(Boolean)
    .join(" ")
    .trim();
}

function initialsFor(session: AuthSession) {
  const name = displayName(session) || session.user.email;
  return name
    .split(/\s|@/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function roleLabel(role: string) {
  if (role.toLowerCase() === "merchant") return "Merchant";
  if (role.toLowerCase() === "admin") return "Admin";
  return role;
}

export default function UserAccountPage() {
  const router = useRouter();
  const [shops, setShops] = useState<Shop[]>([]);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
    const s = getAuthSession();
    if (!s) {
      router.push("/signin?redirect=%2Fuser");
      return;
    }
    setSession(s);
  }, [router]);

  useEffect(() => {
    let cancelled = false;
    fetchAdminStores()
      .then((list) => {
        if (!cancelled) setShops(list);
      })
      .catch(() => {
        if (!cancelled) setShops([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!mounted || !session) {
    return (
      <div className="flex h-svh items-center justify-center bg-slate-50 px-6 text-slate-500">
        <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm">
          <span className="size-2 animate-pulse rounded-full bg-teal-500" />
          Ачааллаж байна...
        </div>
      </div>
    );
  }

  const name = displayName(session);
  const accountRows = [
    {
      label: "Овог, нэр",
      value: name || "Бүртгээгүй",
      icon: UserRound,
    },
    {
      label: "И-мэйл",
      value: session.user.email,
      icon: Mail,
    },
    {
      label: "Утас",
      value: session.user.phone || "Бүртгээгүй",
      icon: Phone,
    },
    {
      label: "Эрх",
      value: roleLabel(session.user.role),
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="flex h-svh flex-col overflow-hidden bg-slate-50 text-slate-950">
      <div className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex shrink-0 flex-wrap items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-slate-950"
          >
            <Home className="size-4" aria-hidden />
            Нүүр
          </Link>
        </header>

        <main className="flex min-h-0 flex-1 flex-col gap-5 lg:grid lg:h-full lg:min-h-0 lg:grid-cols-[minmax(0,0.9fr)_minmax(420px,1.1fr)] lg:grid-rows-[minmax(0,1fr)] lg:items-stretch">
          <section className="flex min-h-0 flex-col justify-between overflow-y-auto rounded-lg bg-[linear-gradient(135deg,#0f172a_0%,#115e59_56%,#7c2d12_100%)] p-6 text-white shadow-sm sm:p-8 lg:min-h-0">
            <div>
              <div className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/85">
                <BadgeCheck className="size-3.5 text-emerald-200" aria-hidden />
                Идэвхтэй бүртгэл
              </div>
              <div className="mt-8 flex items-end gap-4">
                <div className="flex size-20 shrink-0 items-center justify-center rounded-lg border border-white/20 bg-white text-2xl font-black text-slate-950 shadow-sm">
                  {initialsFor(session)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white/70">
                    Миний бүртгэл
                  </p>
                  <h1 className="mt-1 truncate text-3xl font-black tracking-tight sm:text-4xl">
                    {name || session.user.email}
                  </h1>
                </div>
              </div>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-white/15 bg-white/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
                  Role
                </p>
                <p className="mt-2 text-lg font-bold">
                  {roleLabel(session.user.role)}
                </p>
              </div>
              <div className="rounded-lg border border-white/15 bg-white/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
                  Account ID
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <p className="truncate font-mono text-xs text-white/85 flex-1">
                    {session.user.id}
                  </p>
                  <button
                    type="button"
                    className="shrink-0 text-white/70 hover:text-white transition-colors"
                    onClick={async () => {
                      await navigator.clipboard.writeText(session.user.id);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    title="Copy Account ID"
                  >
                    <Copy className="size-4" />
                  </button>
                </div>
                {copied && (
                  <p className="mt-1 text-xs text-emerald-200">Copied!</p>
                )}
              </div>
              <button
                type="button"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "w-30 rounded-lg border border-white/15 bg-white/10 hover:bg-white/20 hover:border-white/40",
                )}
                onClick={() => {
                  clearAuthSession();
                  router.push("/signin");
                  router.refresh();
                }}
              >
                <LogOut className="size-4" aria-hidden />
                Гарах
              </button>
            </div>
          </section>

          <section className="flex min-h-0 flex-1 flex-col gap-5 overflow-hidden lg:min-h-0">
            <div className="shrink-0 rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="mt-1 text-2xl font-black tracking-tight">
                    Хувийн мэдээлэл
                  </h2>
                </div>
                <span className="inline-flex w-fit items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">
                  <ShieldCheck className="size-3.5" aria-hidden />
                  Verified
                </span>
              </div>

              <dl className="mt-6 grid gap-3 sm:grid-cols-2">
                {accountRows.map((row) => {
                  const Icon = row.icon;
                  return (
                    <div
                      key={row.label}
                      className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                    >
                      <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                        <Icon className="size-4 text-slate-400" aria-hidden />
                        {row.label}
                      </dt>
                      <dd className="mt-2 break-all text-sm font-semibold text-slate-950">
                        {row.value}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </div>

            <div className="flex min-h-0 flex-1 flex-col gap-5 md:grid md:grid-cols-2 md:items-stretch md:gap-5">
              <div className="shrink-0 rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:min-h-0">
                <h2 className="mt-1 text-xl font-black tracking-tight">
                  Дэлгүүрээ үргэлжлүүлэх
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  3агвар, бүтээгдэхүүн, дэлгүүрийн тохиргоогоо үргэлжлүүлэн
                  засах боломжтой.
                </p>
                <div className="mt-5 flex w-full max-w-sm flex-col gap-3">
                  <Link
                    href={PATHS.builderUpdate}
                    className={cn(
                      buttonVariants({ variant: "default", size: "lg" }),
                      "w-full justify-center",
                    )}
                  >
                    Shop нээх
                    <ArrowRight className="size-4" aria-hidden />
                  </Link>
                  <Link
                    href="/admin/overview"
                    className={cn(
                      buttonVariants({ variant: "outline", size: "lg" }),
                      "w-full justify-center",
                    )}
                  >
                    <LayoutDashboard className="size-4" aria-hidden />
                    Admin xэcэг
                    <ArrowRight className="size-4" aria-hidden />
                  </Link>
                </div>
              </div>

              <div className="flex min-h-0 flex-1 flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:h-full md:min-h-0">
                <h2 className="shrink-0 text-xl font-black tracking-tight">
                  Миний дэлгүүрүүд
                </h2>
                <div className="mt-4 min-h-0 flex-1 overflow-y-auto overscroll-contain pr-0.5">
                  {shops && shops.length > 0 ? (
                    <div className="grid gap-4">
                      {shops.map((shop) => {
                        const hasStoreImage = Boolean(shop.logoUrl?.trim());
                        return (
                        <Link
                          key={shop.id}
                          href={`/admin/overview?shop=${shop.id}`}
                          className="group rounded-lg border border-slate-200 bg-slate-50 p-4 transition hover:bg-white hover:shadow-md"
                        >
                          <div className="flex items-center gap-4">
                            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-100 text-slate-500">
                              {hasStoreImage ? (
                                <Image
                                  src={safeImage(shop.logoUrl)}
                                  alt={shop.name}
                                  width={64}
                                  height={64}
                                  className="object-cover"
                                />
                              ) : (
                                <Store
                                  className="size-8 shrink-0"
                                  aria-hidden
                                />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="font-bold text-slate-950 group-hover:text-slate-700">
                                {shop.name}
                              </h3>
                              <p className="mt-1 text-xs text-slate-500">
                                {shop.id}
                              </p>
                              <div
                                className="mt-2 h-1.5 w-20 rounded-full"
                                style={{ backgroundColor: shop.brandColor }}
                              />
                            </div>
                          </div>
                        </Link>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-600">
                      Та дэлгүүр үүсээгүй байна. Builder хэсэгээр шинэ дэлгүүр
                      үүсгэнэ үү.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
