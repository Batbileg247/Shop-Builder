"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, ExternalLink, RotateCcw } from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";
import { HomePage } from "@/components/site/home-page";
import { ThemeStudioLayout } from "@/components/theme-studio/theme-studio-layout";
import type { ShopUpdateInput } from "@/types/dashboard";

const presets = [
  { label: "Violet", brandColor: "#8b5cf6", accentColor: "#f0e7ff" },
  { label: "Mint", brandColor: "#14b8a6", accentColor: "#ccfbf1" },
  { label: "Blue", brandColor: "#3b82f6", accentColor: "#dbeafe" },
  { label: "Orange", brandColor: "#f97316", accentColor: "#ffedd5" },
];

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function CustomizePage() {
  const { activeShop, updateShop } = useDashboard();
  const [form, setForm] = React.useState<ShopUpdateInput>({
    name: activeShop.name,
    slug: activeShop.slug,
    logoUrl: activeShop.logoUrl,
    brandColor: activeShop.brandColor,
    accentColor: activeShop.accentColor,
  });

  React.useEffect(() => {
    setForm({
      name: activeShop.name,
      slug: activeShop.slug,
      logoUrl: activeShop.logoUrl,
      brandColor: activeShop.brandColor,
      accentColor: activeShop.accentColor,
    });
  }, [activeShop]);

  const updateField = <Key extends keyof ShopUpdateInput>(
    key: Key,
    value: ShopUpdateInput[Key],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const saveChanges = () => {
    updateShop(activeShop.id, {
      name: form.name?.trim() || activeShop.name,
      slug: form.slug?.trim() || activeShop.slug,
      logoUrl: form.logoUrl?.trim() || activeShop.logoUrl,
      brandColor: form.brandColor || activeShop.brandColor,
      accentColor: form.accentColor || activeShop.accentColor,
    });
  };

  const resetChanges = () => {
    setForm({
      name: activeShop.name,
      slug: activeShop.slug,
      logoUrl: activeShop.logoUrl,
      brandColor: activeShop.brandColor,
      accentColor: activeShop.accentColor,
    });
  };

  const previewName = form.name || activeShop.name;
  const previewSlug = form.slug || activeShop.slug;
  const previewBrand = form.brandColor || activeShop.brandColor;
  const previewAccent = form.accentColor || activeShop.accentColor;

  return (
    <div>
      <div className="min-h-0 min-w-0 self-stretch">
        <ThemeStudioLayout variant="embedded">
          <HomePage />
        </ThemeStudioLayout>
      </div>
    </div>
  );
}
