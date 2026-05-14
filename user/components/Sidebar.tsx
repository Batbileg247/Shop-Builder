"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  ChevronDown,
  ClipboardList,
  LayoutDashboard,
  Sparkles,
  Store,
} from "lucide-react";
import { getAuthSession, type AuthSession } from "@/lib/auth-session";
import { useDashboard } from "@/context/DashboardContext";
import { safeImage } from "@/lib/utils";
import { PATHS } from "@/lib/site-paths";

const navItems = [
  { label: "Overview", href: "/admin/overview", icon: LayoutDashboard },
  { label: "Orders", href: PATHS.adminOrders, icon: ClipboardList },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Theme studio", href: PATHS.builderUpdate, icon: Sparkles },
];

function navItemIsActive(pathname: string, href: string) {
  if (href === PATHS.builderUpdate) {
    return (
      pathname === PATHS.builder ||
      pathname.startsWith(`${PATHS.builder}/`) ||
      pathname.startsWith("/building")
    );
  }
  return pathname === href;
}

function initialsFor(session: AuthSession) {
  const name =
    [session.user.lastName, session.user.firstName]
      .filter(Boolean)
      .join(" ")
      .trim() || session.user.email;
  return name
    .split(/\s|@/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function Sidebar() {
  const pathname = usePathname();
  const { shops, activeShop, switchShop, isLoadingStores } = useDashboard();
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    const s = getAuthSession();
    if (s) {
      setSession(s);
    }
  }, []);

  return (
    <>
      {/* ── Mobile bar ── */}
      <div className="p-4 pb-0 lg:hidden">
        <div className="rounded-2xl border border-zinc-200 bg-white p-4">
          {/* Brand */}
          <Link
            href="/user"
            className="flex items-center gap-3 hover:opacity-75 transition-opacity"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100 text-xs font-black tracking-tight text-zinc-900">
              {session ? initialsFor(session) : "SB"}
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
                Shop Builder
              </p>
              <h1 className="text-sm font-bold text-zinc-900">Dashboard</h1>
            </div>
          </Link>

          {/* Shop switcher */}
          <div className="relative mt-4">
            {shops.length === 0 ? (
              <p className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-medium text-zinc-500">
                {isLoadingStores
                  ? "Дэлгүүрүүдийг ачааллаж байна…"
                  : "Өгөгдлийн санд дэлгүүр байхгүй байна. Platform-оор дэлгүүр үүсгэнэ үү."}
              </p>
            ) : (
              <>
                <select
                  value={activeShop.id}
                  onChange={(e) => switchShop(e.target.value)}
                  aria-label="Pick the shop you are editing"
                  className="h-11 w-full appearance-none rounded-xl border border-zinc-200 bg-white px-4 pr-10 text-sm font-semibold text-zinc-900 outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
                >
                  {shops.map((shop) => (
                    <option key={shop.id} value={shop.id}>
                      {shop.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
              </>
            )}
          </div>

          {/* Nav grid */}
          <nav className="mt-4 grid grid-cols-2 gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = navItemIsActive(pathname, item.href);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold transition-colors ${
                    isActive
                      ? "bg-zinc-900 text-white"
                      : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* ── Desktop sidebar ── */}
      <aside className="hidden w-[320px] shrink-0 p-6 lg:block">
        <div className="sticky top-6 flex h-[calc(100vh-3rem)] flex-col rounded-2xl border border-zinc-200 bg-white">
          {/* Brand header */}
          <Link
            href="/user"
            className="border-b border-zinc-100 px-7 py-6 block hover:bg-zinc-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100 text-sm font-black tracking-tight text-zinc-900">
                {session ? initialsFor(session) : "SB"}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                  Shop Builder
                </p>
                <h1 className="text-base font-bold text-zinc-900">Dashboard</h1>
              </div>
            </div>
          </Link>

          {/* Shop switcher */}
          <div className="border-b border-zinc-100 px-6 py-5">
            <label
              htmlFor="shop-switcher"
              className="mb-2.5 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400"
            >
              Active shop
            </label>
            <div className="relative">
              {shops.length === 0 ? (
                <p className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-medium text-zinc-500">
                  {isLoadingStores
                    ? "Дэлгүүрүүдийг ачааллаж байна…"
                    : "Дэлгүүр олдсонгүй."}
                </p>
              ) : (
                <>
                  <div className="pointer-events-none absolute left-3.5 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center overflow-hidden rounded-lg border border-zinc-100 bg-zinc-50 text-zinc-500">
                    {activeShop.logoUrl?.trim() ? (
                      <Image
                        src={safeImage(activeShop.logoUrl)}
                        alt=""
                        fill
                        sizes="32px"
                        className="object-cover"
                      />
                    ) : (
                      <Store className="size-4 shrink-0" aria-hidden />
                    )}
                  </div>
                  <select
                    id="shop-switcher"
                    value={activeShop.id}
                    onChange={(e) => switchShop(e.target.value)}
                    className="h-13 w-full appearance-none rounded-xl border border-zinc-200 bg-white py-3 pl-14 pr-10 text-sm font-semibold text-zinc-900 outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
                  >
                    {shops.map((shop) => (
                      <option key={shop.id} value={shop.id}>
                        {shop.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                </>
              )}
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto px-4 py-5" aria-label="Main">
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
              Navigation
            </p>
            <ul className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = navItemIsActive(pathname, item.href);
                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3.5 rounded-xl px-4 py-3.5 text-sm font-semibold transition-colors ${
                        isActive
                          ? "bg-zinc-900 text-white"
                          : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                      }`}
                    >
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                          isActive
                            ? "bg-white/10 text-white"
                            : "bg-zinc-100 text-zinc-400"
                        }`}
                      >
                        <Icon className="h-4.5 w-4.5" />
                      </span>
                      {item.label}
                      {isActive && (
                        <span className="ml-auto h-2 w-2 rounded-full bg-white/60" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}
