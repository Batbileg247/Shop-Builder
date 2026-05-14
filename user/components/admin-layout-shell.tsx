import type { ReactNode } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

import { Sidebar } from "@/components/Sidebar";
import { PATHS } from "@/lib/site-paths";

/** Top title row + primary CTA — matches all dashboard pages including theme studio. */
export function AdminDashboardChrome({
  title = "Admin Dashboard",
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="mb-6 flex shrink-0 items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-950">{title}</h1>
        <Link
          href={PATHS.adminShop}
          className="flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-800"
        >
          <Plus className="h-4 w-4" />
          Create New Shop
        </Link>
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
