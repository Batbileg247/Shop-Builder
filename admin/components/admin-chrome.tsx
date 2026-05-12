"use client";

import { usePathname } from "next/navigation";
import { Bell, Search } from "lucide-react";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { AppSidebar } from "@/components/app-sidebar";
import { UserMenu } from "@/components/user-menu";

const titles: Record<string, string> = {
  "/": "Dashboard",
  "/merchants": "Merchants",
  "/stores": "Stores",
  "/products": "Products",
  "/analytics": "Analytics",
};

function headerTitle(pathname: string) {
  if (titles[pathname]) return titles[pathname];
  const base = `/${pathname.split("/")[1]}`;
  return titles[base] ?? "Dashboard";
}

export function AdminChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const pageTitle = headerTitle(pathname);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex min-h-svh flex-col bg-background">
        <header className="shrink-0 border-b border-neutral-200/80 bg-card px-4 py-3 sm:px-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
            <div className="flex min-w-0 items-center gap-2.5">
              <SidebarTrigger className="-ml-0.5 size-8 shrink-0 rounded-lg text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 md:size-9" />
              <h1 className="truncate text-xl font-semibold tracking-tight text-neutral-900 sm:text-2xl">
                {pageTitle}
              </h1>
            </div>

            <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-end lg:max-w-[min(100%,28rem)] lg:flex-1 xl:max-w-md">
              <div className="relative w-full flex-1">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400"
                  aria-hidden
                />
                <Input
                  type="search"
                  placeholder="Search…"
                  className="h-9 w-full rounded-full border-neutral-200/90 bg-neutral-100/60 pl-9 pr-3 text-sm text-neutral-900 shadow-none placeholder:text-neutral-400 focus-visible:border-neutral-300 focus-visible:ring-[#111827]/15 sm:h-10"
                />
              </div>
              <div className="flex shrink-0 items-center justify-end gap-1 sm:gap-1.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-9 shrink-0 rounded-full text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                  aria-label="Notifications"
                >
                  <Bell className="size-[18px]" />
                </Button>
                <UserMenu />
              </div>
            </div>
          </div>
        </header>

        <div className="flex flex-1 flex-col">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
