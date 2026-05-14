"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminLayoutShell } from "@/components/admin-layout-shell";
import { DashboardProvider } from "@/context/DashboardContext";
import { PATHS } from "@/lib/site-paths";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardProvider>
      <AdminLayoutShell>
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-950">Admin Dashboard</h1>
          <Link
            href={PATHS.adminCustomize}
            className="flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" />
            Create New Shop
          </Link>
        </div>
        {children}
      </AdminLayoutShell>
    </DashboardProvider>
  );
}
