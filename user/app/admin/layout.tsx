"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { DashboardProvider } from "@/context/DashboardContext";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardProvider>
      <div className="min-h-screen min-w-full bg-[#f8f9fe] text-slate-950">
        <div className=" flex min-h-screen w-full max-w-[1720px] gap-2">
          <Sidebar />
          <main className="min-w-full flex-1 px-4 py-5 sm:px-6 lg:pl-2 lg:pr-2">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-2xl font-bold text-slate-950">
                Admin Dashboard
              </h1>
              <Link
                href="/builder"
                className="flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-800"
              >
                <Plus className="h-4 w-4" />
                Create New Shop
              </Link>
            </div>
            {children}
          </main>
        </div>
      </div>
    </DashboardProvider>
  );
}
