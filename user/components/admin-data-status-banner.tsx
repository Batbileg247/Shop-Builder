"use client";

import { useDashboard } from "@/context/DashboardContext";

/** API / өгөгдлийн алдааг admin provider дотор харуулна. */
export function AdminDataStatusBanner() {
  const { loadError, isLoadingStores } = useDashboard();
  if (!loadError || isLoadingStores) return null;
  return (
    <div
      className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800"
      role="alert"
    >
      {loadError}
    </div>
  );
}
