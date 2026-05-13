"use client";

import { ShopProvider } from "@/app/hooks/useShop";
import { StoreProvider } from "@/context/store-context";
import { ThemeStudioLayout } from "@/components/theme-studio/theme-studio-layout";

/**
 * Combines incoming Theme Studio (`StoreProvider` + preview chrome) with keeper
 * shop state (`ShopProvider` for `/builder/panel`, `/builder/catalog`, etc.).
 */
export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StoreProvider>
      <ShopProvider>
        <ThemeStudioLayout>{children}</ThemeStudioLayout>
      </ShopProvider>
    </StoreProvider>
  );
}
