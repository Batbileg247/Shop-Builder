"use client";

import { ChevronDown } from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";

export function ShopSwitcher() {
  const { shops, activeShop, switchShop } = useDashboard();

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-500">
        Select shop
      </label>
      <div className="relative">
        <select
          value={activeShop.id}
          onChange={(event) => switchShop(event.target.value)}
          className="w-full appearance-none rounded-3xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-900 outline-none transition focus:border-slate-400"
          style={{ borderColor: activeShop.brandColor }}
        >
          {shops.map((shop) => (
            <option key={shop.id} value={shop.id}>
              {shop.name}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </div>
    </div>
  );
}
