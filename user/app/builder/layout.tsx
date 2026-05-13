"use client";

import { ShopProvider } from "@/app/hooks/useShop";
import { ThemeStudioLayout } from "@/components/theme-studio/theme-studio-layout";

/**
 * Combines incoming Theme Studio (`StoreProvider` + preview chrome) with keeper
 * shop state (`ShopProvider`) — used by Theme Studio preview.
 */
export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ShopProvider>
      <ThemeStudioLayout>{children}</ThemeStudioLayout>
    </ShopProvider>
  );
}
