"use client";

import * as React from "react";

import { useBuilderUi } from "@/context/builder-ui-context";
import { builderDemoCtaButtonClassName } from "@/lib/builder-demo-cta-button";
import { useThemeStore } from "@/stores/useThemeStore";
import { PanelLeftClose } from "lucide-react";

import { ThemeEditorSidebar } from "./theme-editor-sidebar";
import SparkleButton from "@/app/components/LandingPage/SparkleButton";

export type ThemeStudioLayoutVariant = "fullscreen" | "embedded";

type ThemeStudioLayoutProps = {
  children: React.ReactNode;
  /** `embedded` = inside a constrained admin column (no fixed viewport chrome). */
  variant?: ThemeStudioLayoutVariant;
};

/** Theme Studio shell: fullscreen (legacy full-viewport) or embedded in admin main. */
export function ThemeStudioLayout({
  children,
  variant = "fullscreen",
}: ThemeStudioLayoutProps) {
  const { isDemo, setIsDemo } = useBuilderUi();
  const preset = useThemeStore((s) => s.preset);
  const radius = useThemeStore((s) => s.radius);
  const cardContentPaddingRem = useThemeStore((s) => s.cardContentPaddingRem);
  const productGridGapRem = useThemeStore((s) => s.productGridGapRem);
  const previewProductCardBasisRem = useThemeStore(
    (s) => s.previewProductCardBasisRem,
  );

  const previewCssVars = React.useMemo(
    () =>
      ({
        "--pv-card-content-pad": `${cardContentPaddingRem}rem`,
        "--pv-product-gap": `${productGridGapRem}rem`,
        "--pv-preview-card-basis": `${previewProductCardBasisRem}rem`,
        "--pv-radius": `${radius}px`,
      }) as React.CSSProperties,
    [cardContentPaddingRem, productGridGapRem, previewProductCardBasisRem, radius],
  );

  // The cart drawer and other overlays render in a portal (document.body),
  // so we mirror the preview theme tokens onto <body> as well.
  React.useEffect(() => {
    const el = document.body;
    el.classList.add("site-preview-root");
    el.setAttribute("data-theme", preset);
    el.style.setProperty(
      "--pv-card-content-pad",
      `${cardContentPaddingRem}rem`,
    );
    el.style.setProperty("--pv-product-gap", `${productGridGapRem}rem`);
    el.style.setProperty(
      "--pv-preview-card-basis",
      `${previewProductCardBasisRem}rem`,
    );
    el.style.setProperty("--pv-radius", `${radius}px`);
    return () => {
      el.classList.remove("site-preview-root");
      el.removeAttribute("data-theme");
      el.style.removeProperty("--pv-card-content-pad");
      el.style.removeProperty("--pv-product-gap");
      el.style.removeProperty("--pv-preview-card-basis");
      el.style.removeProperty("--pv-radius");
    };
  }, [preset, cardContentPaddingRem, productGridGapRem, previewProductCardBasisRem, radius]);

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

  if (variant === "embedded") {
    return (
      <div className="flex min-h-0 w-full flex-1 bg-[#f8f9fe]">
        <div className="flex min-h-0 w-64 shrink-0 overflow-hidden">
          <ThemeEditorSidebar />
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
        <ThemeEditorSidebar />
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
