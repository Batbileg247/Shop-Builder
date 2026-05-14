"use client";

import * as React from "react";

import { useBuilderUi } from "@/context/builder-ui-context";
import { builderDemoCtaButtonClassName } from "@/lib/builder-demo-cta-button";
import { useThemeStore } from "@/stores/useThemeStore";
import { cn } from "@/lib/utils";
import { PanelLeftClose } from "lucide-react";

import { BuilderEditorSidebar } from "./builder-editor-sidebar";
import SparkleButton from "@/app/components/LandingPage/SparkleButton";

export type BuilderStudioLayoutVariant =
  | "fullscreen"
  | "embedded"
  /** Preview only: theme editor lives in the admin shell sidebar slot; no internal editor column. */
  | "previewOnly";

type BuilderStudioLayoutProps = {
  children: React.ReactNode;
  /** `embedded` = editor + preview in one row. `previewOnly` = preview surface only (editor is external). */
  variant?: BuilderStudioLayoutVariant;
};

function PreviewOnlyAnimatedSurface({
  children,
  preset,
  previewCssVars,
}: {
  children: React.ReactNode;
  preset: string;
  previewCssVars: React.CSSProperties;
}) {
  const [entered, setEntered] = React.useState(false);

  React.useEffect(() => {
    const t = window.setTimeout(() => setEntered(true), 120);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden">
      <div
        data-theme={preset}
        className={cn(
          "site-preview-root min-h-0 flex-1 overflow-y-auto bg-pv-bg transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transform-none motion-reduce:opacity-100",
          entered ? "translate-x-0 opacity-100" : "translate-x-5 opacity-0",
        )}
        style={previewCssVars}
      >
        {children}
      </div>
    </div>
  );
}

/** Full-screen theme studio (fork for `/builder`). */
export function BuilderStudioLayout({
  children,
  variant = "fullscreen",
}: BuilderStudioLayoutProps) {
  const { isDemo, setIsDemo } = useBuilderUi();
  const preset = useThemeStore((s) => s.preset);
  const radius = useThemeStore((s) => s.radius);
  const cardContentPaddingRem = useThemeStore((s) => s.cardContentPaddingRem);
  const productGridGapRem = useThemeStore((s) => s.productGridGapRem);

  const previewCssVars = React.useMemo(
    () =>
      ({
        "--pv-card-content-pad": `${cardContentPaddingRem}rem`,
        "--pv-product-gap": `${productGridGapRem}rem`,
        "--pv-radius": `${radius}px`,
      }) as React.CSSProperties,
    [cardContentPaddingRem, productGridGapRem, radius],
  );

  React.useEffect(() => {
    const el = document.body;
    el.classList.add("site-preview-root");
    el.setAttribute("data-theme", preset);
    el.style.setProperty(
      "--pv-card-content-pad",
      `${cardContentPaddingRem}rem`,
    );
    el.style.setProperty("--pv-product-gap", `${productGridGapRem}rem`);
    el.style.setProperty("--pv-radius", `${radius}px`);
    return () => {
      el.classList.remove("site-preview-root");
      el.removeAttribute("data-theme");
      el.style.removeProperty("--pv-card-content-pad");
      el.style.removeProperty("--pv-product-gap");
      el.style.removeProperty("--pv-radius");
    };
  }, [preset, cardContentPaddingRem, productGridGapRem, radius]);

  React.useEffect(() => {
    if (!isDemo) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isDemo]);

  if (isDemo) {
    return (
      <main
        data-theme={preset}
        className="site-preview-root fixed inset-0 z-100 flex min-h-0 w-full flex-col overflow-y-auto overscroll-contain bg-pv-bg"
        style={previewCssVars}
      >
        {children}
        <div className="pointer-events-none fixed inset-x-0 top-0 z-[300] flex justify-end p-4">
          <div className="pointer-events-auto">
            <SparkleButton
              label="Back to Editor"
              icon={PanelLeftClose}
              className={builderDemoCtaButtonClassName()}
              onClick={() => setIsDemo(false)}
            />
          </div>
        </div>
      </main>
    );
  }

  if (variant === "previewOnly") {
    return (
      <PreviewOnlyAnimatedSurface
        preset={preset}
        previewCssVars={previewCssVars}
      >
        {children}
      </PreviewOnlyAnimatedSurface>
    );
  }

  if (variant === "embedded") {
    return (
      <div className="flex min-h-0 w-full flex-1 bg-[#f8f9fe]">
        <div className="flex min-h-0 w-64 shrink-0 overflow-hidden">
          <BuilderEditorSidebar />
        </div>
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <div
            data-theme={preset}
            className="site-preview-root min-h-0 flex-1 overflow-y-auto bg-pv-bg"
            style={previewCssVars}
          >
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-svh w-full bg-[#f8f9fe]">
      <div className="fixed left-0 top-0 z-40 h-svh w-64 border-r border-sidebar-border shadow-[4px_0_24px_rgba(0,0,0,0.06)]">
        <BuilderEditorSidebar />
      </div>

      <div className="ml-64 flex min-h-svh min-w-0 flex-1 flex-col">
        <div
          data-theme={preset}
          className="site-preview-root min-h-svh flex-1"
          style={previewCssVars}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
