"use client";

import { Store } from "lucide-react";

import SparkleButton from "@/app/components/LandingPage/SparkleButton";
import { useDashboard } from "@/context/DashboardContext";
import { PATHS } from "@/lib/site-paths";

/** Theme studio chrome — идэвхтэй дэлгүүрийн public storefront (`/s/:id`). */
export function BuilderChromeMyShopButton() {
  const { activeShop, isLoadingStores } = useDashboard();
  if (isLoadingStores) return null;
  if (!activeShop.id || activeShop.id === "__loading__") return null;

  return (
    <SparkleButton
      label="My shop"
      icon={Store}
      href={PATHS.storefront(activeShop.id)}
      className="h-9 gap-3"
    />
  );
}
