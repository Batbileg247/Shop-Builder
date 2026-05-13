"use client";

import { StoreProvider } from "@/context/store-context";
import { ThemeStudioLayout } from "@/components/theme-studio/theme-studio-layout";

export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StoreProvider>
      <ThemeStudioLayout>{children}</ThemeStudioLayout>
    </StoreProvider>
  );
}
