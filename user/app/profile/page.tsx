"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  ChevronRight,
  Home,
  LayoutDashboard,
  LogOut,
  Mail,
  Phone,
  ShieldCheck,
  Store,
  UserRound,
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

  useEffect(() => {
    setMounted(true);
    const s = getAuthSession();
    if (!s) {
      router.push("/signin?redirect=%2Fprofile");
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
      <div className="flex min-h-svh items-center justify-center bg-[radial-gradient(circle_at_top,#ecfeff,transparent_35%),linear-gradient(to_bottom,#f8fafc,#f1f5f9)] px-6 text-slate-500">
        <div className="flex items-center gap-3 rounded-2xl border border-white/50 bg-white/70 px-5 py-4 text-sm shadow-xl backdrop-blur-xl">
          <span className="size-2 animate-pulse rounded-full bg-teal-500" />
          Ачааллаж байна...
        </div>
      </div>
    );
  }

  const name = displayName(session);

  const infoRows = [
    {
      label: "Овог, нэр",
      value: name || "Бүртгээгүй",
      icon: UserRound,
      empty: !name,
    },
    {
      label: "И-мэйл",
      value: session.user.email,
      icon: Mail,
      empty: false,
    },
    {
      label: "Утас",
      value: session.user.phone || "Бүртгээгүй",
      icon: Phone,
      empty: !session.user.phone,
    },
    {
      label: "Эрх",
      value: roleLabel(session.user.role),
      icon: ShieldCheck,
      empty: false,
    },
  ];

  return (
    <div className="min-h-svh bg-[radial-gradient(circle_at_top,#ecfeff,transparent_35%),linear-gradient(to_bottom,#f8fafc,#f1f5f9)] text-slate-950">
      <div className="mx-auto flex min-h-svh w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* Top Bar */}
        <header className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/60 bg-white/70 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm backdrop-blur-xl transition-all hover:bg-white hover:text-slate-900 hover:shadow-md"
          >
            <Home className="size-4" />
            Нүүр
          </Link>
        </header>

        {/* Main Layout — sidebar + content, both stretch to same height */}
        <main className="grid flex-1 items-stretch gap-6 lg:grid-cols-[460px_minmax(0,1fr)]">
          {/* ── SIDEBAR ── */}
          <section className="relative flex flex-col overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8 text-white shadow-2xl">
            {/* Glows */}
            <span className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-teal-400/20 blur-3xl" />
            <span className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />

            {/* TOP CONTENT */}
            <div className="relative flex flex-col gap-7">
              {/* Badge */}
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/80 backdrop-blur-xl">
                <span className="size-1.5 rounded-full bg-emerald-400" />
                Идэвхтэй бүртгэл
              </div>

              {/* Avatar + Name */}
              <div className="flex items-start gap-5">
                <div className="flex size-20 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-white to-slate-200 text-2xl font-bold text-slate-900 shadow-xl ring-4 ring-white/10">
                  {initialsFor(session)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                    Миний бүртгэл
                  </p>
                  <h1 className="mt-1 break-words text-2xl font-bold leading-snug tracking-tight">
                    {name || session.user.email}
                  </h1>
                  {name && (
                    <p className="mt-1.5 break-all text-sm leading-relaxed text-white/60">
                      {session.user.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-white/0 via-white/10 to-white/0" />

              {/* Role + Account ID */}
              <div className="grid gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/10 px-5 py-4 backdrop-blur-xl">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-white/40">
                    Role
                  </p>
                  <p className="mt-2 text-base font-semibold text-white">
                    {roleLabel(session.user.role)}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/10 px-5 py-4 backdrop-blur-xl">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-white/40">
                    Account ID
                  </p>
                  <p className="mt-2 break-all font-mono text-xs leading-relaxed text-white/70">
                    {session.user.id}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-white/0 via-white/10 to-white/0" />

              {/* Personal Info */}
              <div>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="size-5 text-teal-400" />
                    <h2 className="text-base font-semibold tracking-tight text-white">
                      Хувийн мэдээлэл
                    </h2>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 ring-1 ring-emerald-500/20">
                    <ShieldCheck className="size-3" />
                    Verified
                  </span>
                </div>

                <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                  {infoRows.map(({ label, value, icon: Icon, empty }) => (
                    <div
                      key={label}
                      className="group rounded-2xl border border-white/10 bg-white/5 p-4 transition-all hover:border-teal-400/30 hover:bg-white/10"
                    >
                      <dt className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
                        <Icon className="size-3.5 transition group-hover:text-teal-400" />
                        {label}
                      </dt>
                      <dd
                        className={cn(
                          "mt-2 break-all text-sm font-medium",
                          empty ? "text-white/30" : "text-white/90",
                        )}
                      >
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            {/* BOTTOM — logout pinned to bottom */}
            <div className="relative mt-auto pt-7">
              <div className="mb-5 h-px bg-gradient-to-r from-white/0 via-white/10 to-white/0" />
              <button
                type="button"
                onClick={() => {
                  clearAuthSession();
                  router.push("/signin");
                  router.refresh();
                }}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-5 py-3 text-sm font-medium text-white/80 backdrop-blur-xl transition-all hover:border-white/20 hover:bg-white/20 hover:text-white"
              >
                <LogOut className="size-4" />
                Гарах
              </button>
            </div>
          </section>

          {/* ── RIGHT CONTENT ── */}
          <div className="flex flex-col gap-6">
            {/* Shop Settings */}
            <section className="rounded-[32px] border border-slate-200/70 bg-white/80 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl">
              <div className="flex items-center gap-2">
                <LayoutDashboard className="size-5 text-teal-600" />
                <h2 className="text-lg font-semibold tracking-tight">
                  Дэлгүүрийн тохиргоо
                </h2>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Загвар, бүтээгдэхүүн болон дэлгүүрийн тохиргоогоо үргэлжлүүлэн
                засах боломжтой.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/builder"
                  className={cn(
                    buttonVariants({ size: "sm" }),
                    "rounded-2xl bg-slate-900 px-5 shadow-lg shadow-slate-900/10 transition hover:bg-slate-800",
                  )}
                >
                  <Store className="size-4" />
                  Shop нээх
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/admin/overview"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "rounded-2xl border-slate-200 bg-white transition hover:bg-slate-50",
                  )}
                >
                  <LayoutDashboard className="size-4" />
                  Admin хэсэг
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </section>

            {/* Shops — flex-1 so it fills remaining height */}
            <section className="flex flex-1 flex-col rounded-[32px] border border-slate-200/70 bg-white/80 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl">
              <div className="flex items-center gap-2">
                <Store className="size-5 text-teal-600" />
                <h2 className="text-lg font-semibold tracking-tight">
                  Миний дэлгүүрүүд
                </h2>
              </div>

              {shops && shops.length > 0 ? (
                <ul className="mt-5 flex flex-col gap-3 overflow-y-auto pr-0.5">
                  {shops.map((shop) => (
                    <li key={shop.id}>
                      <Link
                        href={`/admin/overview?shop=${shop.id}`}
                        className="group flex items-center gap-4 rounded-2xl border border-slate-200/70 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-lg"
                      >
                        <div className="relative size-12 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-sm">
                          <Image
                            src={safeImage(shop.logoUrl)}
                            alt={shop.name}
                            width={48}
                            height={48}
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold tracking-tight text-slate-900">
                            {shop.name}
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <span
                              className="h-2 w-2 rounded-full"
                              style={{ backgroundColor: shop.brandColor }}
                            />
                            <span className="text-[11px] text-slate-400">
                              {shop.slug}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="size-4 shrink-0 text-slate-300 transition group-hover:text-slate-500" />
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="mt-5 flex flex-1 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
                  <Store className="mx-auto size-10 text-slate-300" />
                  <h3 className="mt-4 text-sm font-semibold text-slate-900">
                    Дэлгүүр алга байна
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Builder ашиглан анхны дэлгүүрээ үүсгээрэй.
                  </p>
                  <Link
                    href="/builder"
                    className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
                  >
                    Дэлгүүр үүсгэх
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
