import * as React from "react";

import { StorefrontProvider } from "@/components/storefront/storefront-provider";

export default async function StorefrontLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <StorefrontProvider slug={slug}>{children}</StorefrontProvider>
  );
}

