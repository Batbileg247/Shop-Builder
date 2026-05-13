"use client";

import * as React from "react";

export type BuilderUiContextValue = {
  isDemo: boolean;
  setIsDemo: (value: boolean) => void;
  /** Hero panel height as % of the shop preview host (builder + demo locked split). */
  heroPanelPercent: number;
  setHeroPanelPercent: (value: number) => void;
};

const BuilderUiContext = React.createContext<BuilderUiContextValue | null>(null);

export function BuilderUiProvider({ children }: { children: React.ReactNode }) {
  const [isDemo, setIsDemo] = React.useState(false);
  const [heroPanelPercent, setHeroPanelPercent] = React.useState(44);

  const value = React.useMemo(
    () => ({
      isDemo,
      setIsDemo,
      heroPanelPercent,
      setHeroPanelPercent,
    }),
    [isDemo, heroPanelPercent],
  );

  return (
    <BuilderUiContext.Provider value={value}>{children}</BuilderUiContext.Provider>
  );
}

export function useBuilderUi(): BuilderUiContextValue {
  const ctx = React.useContext(BuilderUiContext);
  if (!ctx) {
    throw new Error("useBuilderUi must be used within BuilderUiProvider");
  }
  return ctx;
}
