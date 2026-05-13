"use client";

import * as React from "react";

import { useBuilderUi } from "@/context/builder-ui-context";
import { builderDemoCtaButtonClassName } from "@/lib/builder-demo-cta-button";
import { useThemeStore } from "@/stores/useThemeStore";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/button";
import { PanelLeftClose } from "lucide-react";

import { ThemeEditorSidebar } from "./theme-editor-sidebar";

/** Theme Studio shell for `/builder` routes. */
export function ThemeStudioLayout({ children }: { children: React.ReactNode }) {
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
        className="site-preview-root relative z-50 w-full min-h-screen overflow-y-auto bg-pv-bg"
        style={previewCssVars}
      >
        <Button
          type="button"
          variant="default"
          size="lg"
          className={cn(
            builderDemoCtaButtonClassName(),
            "fixed right-4 top-4 z-60",
          )}
          onClick={() => setIsDemo(false)}
        >
          <PanelLeftClose className="size-4 opacity-95" aria-hidden />
          Back to Editor
        </Button>
        {children}
      </main>
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
