"use client";

import type { ReactNode } from "react";
import { Plus } from "lucide-react";
import { usePathname } from "next/navigation";

import SparkleButton from "@/app/components/LandingPage/SparkleButton";
import { BuilderChromeMyShopButton } from "@/components/builder-studio/builder-chrome-my-shop-button";
import { BuilderChromeViewDemoButton } from "@/components/builder-studio/builder-chrome-view-demo-button";
import { Sidebar } from "@/components/Sidebar";
import { PATHS } from "@/lib/site-paths";
/** Top title row + primary CTA — matches all dashboard pages including theme studio. */
export function AdminDashboardChrome({
  title = "Admin Dashboard",
  showViewDemo = false,
  children,
}: {
  title?: string;
  /** Theme studio / builder preview: opens full-screen demo from the dashboard chrome. */
  showViewDemo?: boolean;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const hideCreateShopCta =
    pathname.startsWith(PATHS.builderCreate) ||
    pathname.startsWith(PATHS.buildingCreate);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="mb-6 flex shrink-0 items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-950">{title}</h1>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {showViewDemo ? (
            <>
              <BuilderChromeViewDemoButton />
              <BuilderChromeMyShopButton />
            </>
          ) : null}
          {!hideCreateShopCta ? (
            <SparkleButton
              label="Create New Shop"
              icon={Plus}
              href={PATHS.builderCreate}
              size="compact"
              className="gap-2"
            />
          ) : null}
        </div>
      </div>
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  );
}

export function AdminLayoutShell({
  children,
  sidebarReplacement,
}: {
  children: ReactNode;
  /** When set, replaces the dashboard nav sidebar (e.g. theme studio live editor in the same slot). */
  sidebarReplacement?: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f8f9fe] text-slate-950">
      <div className="mx-auto flex min-h-screen w-full max-w-[1720px] gap-2">
        {sidebarReplacement ?? <Sidebar />}
        <main className="flex min-h-0 min-w-0 flex-1 flex-col px-4 py-5 sm:px-6 lg:pl-2 lg:pr-8">
          {children}
        </main>
      </div>
    </div>
  );
}
