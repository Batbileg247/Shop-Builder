import { Suspense } from "react";

import { SkillsetDashboard } from "@/components/skillset-dashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchAdminStats } from "@/lib/fetch-admin-stats";

/** Dashboard нь `/admin/stats`-аас бодит өгөгдөл татдаг — static/prerender-ээр freeze хийхгүй. */
export const dynamic = "force-dynamic";

async function DashboardData() {
  const result = await fetchAdminStats();
  return <SkillsetDashboard result={result} />;
}

function DashboardSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 p-6 lg:p-8">
      <div className="space-y-2">
        <Skeleton className="h-3 w-20 rounded-full" />
        <Skeleton className="h-4 w-64 max-w-full rounded-full" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-[148px] rounded-[24px] border-none shadow-sm"
          />
        ))}
      </div>
      <p className="text-center text-xs text-neutral-500">Ачаалж байна…</p>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardData />
    </Suspense>
  );
}
