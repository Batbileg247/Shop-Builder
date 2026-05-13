"use client";

import * as React from "react";

import type { SiteProduct } from "@/lib/site-mock-products";
import { fetchStorefrontBySlug, mapToSiteProducts } from "@/lib/storefront-api";

export function useStorefrontProducts(slug: string | null | undefined) {
  const [products, setProducts] = React.useState<SiteProduct[] | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!slug || !slug.trim()) {
      setProducts(null);
      setLoading(false);
      setError(null);
      return;
    }

    const ac = new AbortController();
    setLoading(true);
    setError(null);

    fetchStorefrontBySlug(slug.trim(), { signal: ac.signal })
      .then((data) => {
        setProducts(mapToSiteProducts(data.products || []));
      })
      .catch((e) => {
        if (ac.signal.aborted) return;
        setError(e instanceof Error ? e.message : "Fetch error");
        setProducts(null);
      })
      .finally(() => {
        if (ac.signal.aborted) return;
        setLoading(false);
      });

    return () => ac.abort();
  }, [slug]);

  return { products, loading, error };
}

