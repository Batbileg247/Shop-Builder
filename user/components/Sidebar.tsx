"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  ChevronDown,
  LayoutDashboard,
  Palette,
  Settings,
  Users,
  User,
} from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";

const navItems = [
  { label: "Overview", href: "/admin/overview", icon: LayoutDashboard },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Customize", href: "/admin/customize", icon: Palette },
];

export function Sidebar() {
  const pathname = usePathname();
  const { shops, activeShop, switchShop, metrics } = useDashboard();

  return (
    <>
      <div className="p-4 pb-0 lg:hidden">
        <div className="rounded-[2rem] bg-white p-4 shadow-[0_18px_50px_rgba(15,23,42,0.07)]">
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-2xl text-xs font-black text-white"
              style={{ backgroundColor: activeShop.brandColor }}
            >
              SB
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Shop Builder
              </p>
              <h1 className="text-base font-black text-slate-950">Dashboard</h1>
            </div>
          </div>
          <div className="relative mt-4 rounded-[1.5rem] bg-slate-50 p-2">
            <select
              value={activeShop.id}
              onChange={(event) => switchShop(event.target.value)}
              aria-label="Pick the shop you are editing"
              className="h-12 w-full appearance-none rounded-[1.15rem] border border-white bg-white px-4 pr-10 text-sm font-bold text-slate-900 outline-none"
            >
              {shops.map((shop) => (
                <option key={shop.id} value={shop.id}>
                  {shop.name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-6 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
          <nav className="mt-4 grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-2xl px-3 py-3 text-xs font-bold transition ${
                    isActive
                      ? "bg-slate-950 text-white"
                      : "bg-slate-50 text-slate-500"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <aside className="hidden w-[292px] shrink-0 p-5 lg:block">
        <div className="sticky top-5 flex h-[calc(100vh-2.5rem)] flex-col rounded-[2rem] bg-white p-5 shadow-[0_24px_70px_rgba(15,23,42,0.07)]">
          <div className="flex items-center gap-3 px-2">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-black text-white shadow-lg shadow-slate-200"
              style={{ backgroundColor: activeShop.brandColor }}
            >
              SB
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Shop Builder
              </p>
              <h1 className="text-lg font-bold text-slate-950">Dashboard</h1>
            </div>
          </div>

          <div className="mt-8">
            <label
              htmlFor="shop-switcher"
              className="mb-3 block px-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-400"
            >
              Switch shop
            </label>
            <div className="relative rounded-[1.5rem] bg-slate-50 p-2">
              <div className="pointer-events-none absolute left-4 top-1/2 z-10 h-10 w-10 -translate-y-1/2 overflow-hidden rounded-2xl bg-white shadow-sm">
                <Image
                  src={activeShop.logoUrl}
                  alt=""
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
              <select
                id="shop-switcher"
                value={activeShop.id}
                onChange={(event) => switchShop(event.target.value)}
                className="h-14 w-full appearance-none rounded-[1.25rem] border border-white bg-white py-2 pl-14 pr-10 text-sm font-bold text-slate-900 outline-none transition focus:border-slate-200 focus:ring-4 focus:ring-slate-100"
              >
                {shops.map((shop) => (
                  <option key={shop.id} value={shop.id}>
                    {shop.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-6 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <nav className="mt-8 space-y-2" aria-label="Main">
            <p className="mb-2 px-2 text-xs font-semibold text-slate-400">
              Jump to
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-[1.35rem] px-4 py-3 text-sm font-bold transition ${
                    isActive
                      ? "bg-white text-slate-950 shadow-[0_16px_38px_rgba(15,23,42,0.08)]"
                      : "text-slate-400 hover:bg-slate-50 hover:text-slate-700"
                  }`}
                >
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-2xl"
                    style={{
                      backgroundColor: isActive
                        ? activeShop.accentColor
                        : "#f8fafc",
                      color: isActive ? activeShop.brandColor : "#94a3b8",
                    }}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto space-y-3">
            <Link
              href="/user"
              className="flex items-center gap-3 rounded-[1.35rem] bg-slate-50 px-4 py-3 text-sm font-bold text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <User className="h-4 w-4" />
              My Profile
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
