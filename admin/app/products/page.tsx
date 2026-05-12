import { Suspense } from "react";

import {
  ProductsPageSkeleton,
  ProductsView,
} from "@/components/products-view";
import { fetchProducts } from "@/lib/fetch-products";

export const dynamic = "force-dynamic";

async function ProductsContent() {
  const { list, error } = await fetchProducts();
  return <ProductsView products={list} fetchError={error} />;
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsPageSkeleton />}>
      <ProductsContent />
    </Suspense>
  );
}
