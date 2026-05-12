"use client";

import { TooltipProvider } from "@/components/ui/tooltip";

import { AdminChrome } from "@/components/admin-chrome";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider delayDuration={0}>
      <AdminChrome>{children}</AdminChrome>
    </TooltipProvider>
  );
}
