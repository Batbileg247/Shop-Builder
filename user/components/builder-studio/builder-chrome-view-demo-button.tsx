"use client";

import { Sparkle } from "lucide-react";

import SparkleButton from "@/app/components/LandingPage/SparkleButton";
import { useBuilderUi } from "@/context/builder-ui-context";

/** Theme studio dashboard chrome — enters full preview demo (see `BuilderStudioLayout` exit control). */
export function BuilderChromeViewDemoButton() {
  const { isDemo, setIsDemo } = useBuilderUi();
  if (isDemo) return null;
  return (
    <SparkleButton
      label="View Demo"
      icon={Sparkle}
      size="compact"
      className="gap-2"
      onClick={() => setIsDemo(true)}
    />
  );
}
