"use client";

import * as React from "react";

const StorefrontCatalogEditContext = React.createContext(false);

/** Зөвхөн `/s/...` дээр эзэмшигчид `true` — бусад route дээр default `false`. */
export function StorefrontCatalogEditProvider({
  value,
  children,
}: {
  value: boolean;
  children: React.ReactNode;
}) {
  return (
    <StorefrontCatalogEditContext.Provider value={value}>
      {children}
    </StorefrontCatalogEditContext.Provider>
  );
}

export function useMayEditLiveStorefrontCatalog() {
  return React.useContext(StorefrontCatalogEditContext);
}
