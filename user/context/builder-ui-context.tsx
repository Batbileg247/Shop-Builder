"use client";

import * as React from "react";

export type BuilderUiContextValue = {
  isDemo: boolean;
  setIsDemo: (value: boolean) => void;
};

const BuilderUiContext = React.createContext<BuilderUiContextValue | null>(null);

export function BuilderUiProvider({ children }: { children: React.ReactNode }) {
  const [isDemo, setIsDemo] = React.useState(false);

  const value = React.useMemo(
    () => ({
      isDemo,
      setIsDemo,
    }),
    [isDemo],
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
