"use client";

import * as React from "react";

import { useDashboard } from "@/context/DashboardContext";
import {
  themePersistenceShopIdRef,
  useThemeStore,
} from "@/stores/useThemeStore";

/**
 * Keys zustand theme `persist` to `activeShopId` in localStorage and rehydrates
 * when the sidebar shop switcher changes, so each shop has its own theme slice.
 */
export function ThemeStoreShopPersistenceSync() {
  const activeShopId = useDashboard().activeShopId;

  React.useLayoutEffect(() => {
    themePersistenceShopIdRef.current = activeShopId;
    void useThemeStore.persist.rehydrate();
  }, [activeShopId]);

  return null;
}
