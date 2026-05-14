"use client";

import * as React from "react";

import { ShopProvider } from "@/app/hooks/useShop";
import { BuilderUiProvider } from "@/context/builder-ui-context";
import { ensureAuthCookieFromSession } from "@/lib/auth-session";

export default function CustomizeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  React.useEffect(() => {
    ensureAuthCookieFromSession();
  }, []);

  return (
    <ShopProvider>
      <BuilderUiProvider>{children}</BuilderUiProvider>
    </ShopProvider>
  );
}
