"use client";

import * as React from "react";

import { useBuilderUi } from "@/context/builder-ui-context";
import { builderDemoCtaButtonClassName } from "@/lib/builder-demo-cta-button";
import { useThemeStore } from "@/stores/useThemeStore";
import { cn } from "@/lib/utils";
import { PanelLeftClose } from "lucide-react";

import { ThemeEditorSidebar } from "./theme-editor-sidebar";
import SparkleButton from "@/app/components/LandingPage/SparkleButton";

export type ThemeStudioLayoutVariant = "fullscreen" | "embedded";

type ThemeStudioLayoutProps = {
  children: React.ReactNode;
  /** `embedded` = inside admin `/admin/customize` (no fixed viewport chrome). */
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

  const previewCssVars = React.useMemo(
    () =>
      ({
        "--pv-card-content-pad": `${cardContentPaddingRem}rem`,
        "--pv-product-gap": `${productGridGapRem}rem`,
        "--pv-radius": `${radius}px`,
      }) as React.CSSProperties,
    [cardContentPaddingRem, productGridGapRem, radius],
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
    el.style.setProperty("--pv-radius", `${radius}px`);
    return () => {
      el.classList.remove("site-preview-root");
      el.removeAttribute("data-theme");
      el.style.removeProperty("--pv-card-content-pad");
      el.style.removeProperty("--pv-product-gap");
      el.style.removeProperty("--pv-radius");
    };
  }, [preset, cardContentPaddingRem, productGridGapRem, radius]);

  if (isDemo) {
    return (
      <main
        data-theme={preset}
        className={cn(
          "site-preview-root relative z-50 w-full overflow-y-auto bg-pv-bg",
          variant === "embedded" ? "min-h-[min(100dvh,920px)]" : "min-h-screen",
        )}
        style={previewCssVars}
      >
        <div className="flex justify-end p-2">
          <SparkleButton
            label="Back to Editor"
            icon={PanelLeftClose}
            className={cn(
              builderDemoCtaButtonClassName(),
              variant === "embedded"
                ? "absolute right-4 top-4 z-60"
                : "fixed right-4 top-4 z-60",
            )}
            onClick={() => setIsDemo(false)}
          />
        </div>
        {children}
      </main>
    );
  }

  if (variant === "embedded") {
    return (
      <div className="flex min-h-full w-full min-w-0 flex-1 bg-zinc-100">
        <div className="min-h-full w-[350px] shrink-0 overflow-y-auto bg-white">
          <ThemeEditorSidebar />
        </div>
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <div
            data-theme={preset}
            className="site-preview-root min-h-0 flex-1 overflow-y-auto"
            style={previewCssVars}
          >
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-svh w-full bg-zinc-100">
      <div className="fixed left-0 top-0 z-40 h-svh w-[350px] shadow-[4px_0_24px_rgba(0,0,0,0.06)]">
        <ThemeEditorSidebar />
      </div>

      <div className="ml-[350px] flex min-h-svh min-w-0 flex-1 flex-col">
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
