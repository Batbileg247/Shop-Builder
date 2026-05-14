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
} from "lucide-react";

import {
  clearAuthSession,
  getAuthSession,
  type AuthSession,
} from "@/lib/auth-session";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/ui/button";
import { useDashboard } from "@/context/DashboardContext";
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
  const { shops } = useDashboard();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const s = getAuthSession();
    if (!s) {
      router.push("/signin?redirect=%2Fuser");
      return;
    }
    setSession(s);
  }, [router]);

  if (!mounted || !session) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-slate-50 px-6 text-slate-500">
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
    <div className="min-h-svh bg-slate-50 text-slate-950">
      <div className="mx-auto flex min-h-svh w-full max-w-6xl flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-slate-950"
          >
            <Home className="size-4" aria-hidden />
            Нүүр
          </Link>
        </header>

        <main className="grid flex-1 gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(420px,1.1fr)]">
          <section className="flex flex-col justify-between overflow-hidden rounded-lg bg-[linear-gradient(135deg,#0f172a_0%,#115e59_56%,#7c2d12_100%)] p-6 text-white shadow-sm sm:p-8">
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
                <p className="mt-2 truncate font-mono text-xs text-white/85">
                  {session.user.id}
                </p>
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

          <section className="grid gap-5">
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
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

            <div className="grid gap-5 md:grid-cols-[1fr_280px]">
              <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="mt-1 text-xl font-black tracking-tight">
                  Дэлгүүрээ үргэлжлүүлэх
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  3агвар, бүтээгдэхүүн, дэлгүүрийн тохиргоогоо үргэлжлүүлэн
                  засах боломжтой.
                </p>
                <div className="flex gap-1">
                  <Link
                    href={PATHS.builderUpdate}
                    className={cn(
                      buttonVariants({ variant: "default", size: "lg" }),
                      "mt-5",
                    )}
                  >
                    Shop нээх
                    <ArrowRight className="size-4" aria-hidden />
                  </Link>
                  <Link
                    href="/admin/overview"
                    className={cn(
                      buttonVariants({ variant: "outline", size: "lg" }),
                      "mt-5",
                    )}
                  >
                    <LayoutDashboard className="size-4" aria-hidden />
                    Admin xэcэг
                    <ArrowRight className="size-4" aria-hidden />
                  </Link>
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-xl font-black tracking-tight">
                  Миний дэлгүүрүүд
                </h2>
                {shops && shops.length > 0 ? (
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    {shops.map((shop) => (
                      <Link
                        key={shop.id}
                        href={`/admin/overview?shop=${shop.id}`}
                        className="group rounded-lg border border-slate-200 bg-slate-50 p-4 transition hover:bg-white hover:shadow-md"
                      >
                        <div className="flex items-center gap-4">
                          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-slate-200">
                            <Image
                              src={shop.logoUrl}
                              alt={shop.name}
                              width={64}
                              height={64}
                              className="object-cover"
                            />
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
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-slate-600">
                    Та дэлгүүр үүсээгүй байна. Builder хэсэгээр шинэ дэлгүүр
                    үүсгэнэ үү.
                  </p>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
