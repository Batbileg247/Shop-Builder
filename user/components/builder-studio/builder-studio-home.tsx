"use client";

import { BuilderStudioLayout } from "@/components/builder-studio/builder-studio-layout";
import { HomePage } from "@/components/site/home-page";

export function BuilderStudioHomePage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <BuilderStudioLayout variant="previewOnly">
        <HomePage />
      </BuilderStudioLayout>
    </div>
  );
}
