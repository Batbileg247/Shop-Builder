"use client";

import * as React from "react";
import type { ProductDraft } from "@/types";

export type ShopPreviewDashboardSyncValue = {
  /** When set (dashboard-linked preview), `useShop.addProduct` forwards here instead of local-only state. */
  persistAddFromDraft: (draft: ProductDraft) => void;
};

export const ShopPreviewDashboardSyncContext =
  React.createContext<ShopPreviewDashboardSyncValue | null>(null);
