"use client";

import type { ReactNode } from "react";

import {
  AdminDashboardChrome,
  AdminLayoutShell,
} from "@/components/admin-layout-shell";
import { DashboardProvider } from "@/context/DashboardContext";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardProvider>
      <AdminLayoutShell>
        <AdminDashboardChrome>{children}</AdminDashboardChrome>
      </AdminLayoutShell>
    </DashboardProvider>
  );
}
