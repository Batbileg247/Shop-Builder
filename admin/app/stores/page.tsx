import { Suspense } from "react";

import { StoresPageSkeleton, StoresView } from "@/components/stores-view";
import { fetchStores } from "@/lib/fetch-stores";

export const dynamic = "force-dynamic";

async function StoresContent() {
  const { list, error } = await fetchStores();
  return <StoresView stores={list} fetchError={error} />;
}

export default function StoresPage() {
  return (
    <Suspense fallback={<StoresPageSkeleton />}>
      <StoresContent />
    </Suspense>
  );
}
