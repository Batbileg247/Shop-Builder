"use client";

import * as React from "react";

import { ShopProvider } from "@/app/hooks/useShop";
import { ensureAuthCookieFromSession } from "@/lib/auth-session";
import { ThemeStudioLayout } from "@/components/theme-studio/theme-studio-layout";

export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  React.useEffect(() => {
    ensureAuthCookieFromSession();
  }, []);

  return (
    <ShopProvider>
      <ThemeStudioLayout>{children}</ThemeStudioLayout>
    </ShopProvider>
  );
}
