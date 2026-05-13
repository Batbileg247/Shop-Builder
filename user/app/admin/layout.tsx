import type { ReactNode } from "react";
import { Sidebar } from "@/components/Sidebar";
import { DashboardProvider } from "@/context/DashboardContext";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardProvider>
      <div className="min-h-screen bg-[#f8f9fe] text-slate-950">
        <div className="mx-auto flex min-h-screen w-full max-w-[1720px] gap-2">
          <Sidebar />
          <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:pl-2 lg:pr-8">
            {children}
          </main>
        </div>
      </div>
    </DashboardProvider>
  );
}
