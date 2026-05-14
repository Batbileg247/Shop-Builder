"use client";

import type { ReactNode } from "react";

import { DashboardProvider } from "@/context/DashboardContext";

export default function UserLayout({ children }: { children: ReactNode }) {
  return <DashboardProvider>{children}</DashboardProvider>;
}
