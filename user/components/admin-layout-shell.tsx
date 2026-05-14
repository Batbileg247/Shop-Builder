import type { ReactNode } from "react";

import { Sidebar } from "@/components/Sidebar";

export function AdminLayoutShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f8f9fe] text-slate-950">
      <div className="mx-auto flex min-h-screen w-full max-w-[1720px] gap-2">
        <Sidebar />
        <main className="flex min-h-0 min-w-0 flex-1 flex-col px-4 py-5 sm:px-6 lg:pl-2 lg:pr-8">
          {children}
        </main>
      </div>
    </div>
  );
}
