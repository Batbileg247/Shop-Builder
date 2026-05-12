import { Suspense } from "react";

import {
  MerchantsPageSkeleton,
  MerchantsView,
} from "@/components/merchants-view";
import { fetchMerchants } from "@/lib/fetch-merchants";

export const dynamic = "force-dynamic";

async function MerchantsContent() {
  const { list, error } = await fetchMerchants();
  return <MerchantsView merchants={list} fetchError={error} />;
}

export default function MerchantsPage() {
  return (
    <Suspense fallback={<MerchantsPageSkeleton />}>
      <MerchantsContent />
    </Suspense>
  );
}
