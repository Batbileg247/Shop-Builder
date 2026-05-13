"use client";

import * as React from "react";

import { ShopProvider } from "@/app/hooks/useShop";
import { ThemeStudioLayout } from "@/components/theme-studio/theme-studio-layout";

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
