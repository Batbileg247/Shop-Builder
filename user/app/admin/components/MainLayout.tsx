"use client";

import { Home, Box, ClipboardList, Palette } from "lucide-react";
import type { ReactNode } from "react";
import { ShopSwitcher } from "./ShopSwitcher";
import { useDashboard } from "@/context/DashboardContext";

const navItems = [
  { label: "Dashboard", href: "#overview", icon: Home },
  { label: "Products", href: "#products", icon: Box },
  { label: "Customization", href: "#customization", icon: Palette },
  { label: "Orders", href: "#orders", icon: ClipboardList },
];

export function MainLayout({ children }: { children: ReactNode }) {
  const { activeShop } = useDashboard();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-[1680px] gap-6 px-4 py-6 sm:px-6 lg:px-10">
        <aside className="sticky top-6 hidden h-[calc(100vh-3rem)] w-80 shrink-0 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:block">
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                    Admin
                  </p>
                  <h2 className="text-xl font-semibold text-slate-950">
                    Shop Owner Dashboard
                  </h2>
                </div>
              </div>
              <ShopSwitcher />
            </div>

            <nav className="space-y-2 rounded-3xl border border-slate-200 bg-slate-50 p-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                    style={{ color: activeShop.brandColor }}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </a>
                );
              })}
            </nav>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">
                Active shop
              </p>
              <p className="mt-2 text-sm text-slate-600">{activeShop.name}</p>
              <div
                className="mt-4 h-10 rounded-2xl"
                style={{ backgroundColor: activeShop.brandColor }}
              />
            </div>
          </div>
        </aside>

        <main className="flex-1">
          <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
