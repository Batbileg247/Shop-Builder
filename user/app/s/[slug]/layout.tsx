import * as React from "react";

import { StorefrontTopNav } from "@/components/site/storefront-top-nav";
import { StorefrontProvider } from "@/components/storefront/storefront-provider";

/** Route segment is still named `slug` in the filesystem; value is the shop `id` (`/s/shop_luma`). */
export default async function StorefrontLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug: shopId } = await params;
  return (
    <StorefrontProvider shopId={shopId}>
      <StorefrontTopNav />
      {children}
    </StorefrontProvider>
  );
}

