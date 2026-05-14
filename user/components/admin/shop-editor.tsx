"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, ExternalLink, RotateCcw, Sparkles } from "lucide-react";

import { useDashboard } from "@/context/DashboardContext";
import { PATHS } from "@/lib/site-paths";
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

export function ShopEditor() {
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

  const dirty =
    (form.name?.trim() || "") !== activeShop.name ||
    (form.slug?.trim() || "") !== activeShop.slug ||
    (form.logoUrl?.trim() || "") !== activeShop.logoUrl ||
    (form.brandColor || "") !== activeShop.brandColor ||
    (form.accentColor || "") !== activeShop.accentColor;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 pb-10">
      <header className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
          Shop settings
        </p>
        <h2 className="text-2xl font-black tracking-tight text-slate-950">
          Editing {activeShop.name}
        </h2>
        <p className="text-sm font-medium text-slate-600">
          Branding and identity for this shop only. Switch shops from the sidebar
          to edit another storefront. Theme and layout live in{" "}
          <Link
            href={PATHS.builder}
            className="font-bold text-slate-900 underline decoration-slate-300 underline-offset-2 hover:decoration-slate-900"
          >
            Theme studio
          </Link>
          .
        </p>
      </header>

      <div className="overflow-hidden rounded-[1.75rem] border border-slate-100 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
        <div
          className="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
          style={{
            background: `linear-gradient(135deg, ${previewAccent} 0%, #ffffff 55%, #f8fafc 100%)`,
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="relative h-16 w-16 overflow-hidden rounded-2xl border border-white shadow-md"
              style={{ borderColor: previewBrand }}
            >
              <Image
                src={form.logoUrl || activeShop.logoUrl}
                alt=""
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                Preview
              </p>
              <p className="text-lg font-black text-slate-950">{previewName}</p>
              <p className="text-xs font-semibold text-slate-500">
                /{slugify(previewSlug || "shop")}
              </p>
            </div>
          </div>
          <Link
            href={PATHS.storefront(previewSlug)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 self-start rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-800 shadow-sm transition hover:bg-slate-50 sm:self-auto"
            style={{ borderColor: previewBrand, color: previewBrand }}
          >
            Live storefront
            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>

        <div className="space-y-6 px-6 py-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm font-bold text-slate-700">
              Shop name
              <input
                value={form.name ?? ""}
                onChange={(e) => updateField("name", e.target.value)}
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
              />
            </label>
            <label className="space-y-2 text-sm font-bold text-slate-700">
              Slug
              <input
                value={form.slug ?? ""}
                onChange={(e) => updateField("slug", e.target.value)}
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
              />
            </label>
          </div>

          <label className="block space-y-2 text-sm font-bold text-slate-700">
            Logo URL
            <input
              value={form.logoUrl ?? ""}
              onChange={(e) => updateField("logoUrl", e.target.value)}
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
              placeholder="https://…"
            />
          </label>

          <div>
            <p className="mb-3 text-sm font-bold text-slate-700">Color presets</p>
            <div className="flex flex-wrap gap-2">
              {presets.map((preset) => {
                const active =
                  form.brandColor === preset.brandColor &&
                  form.accentColor === preset.accentColor;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      updateField("brandColor", preset.brandColor);
                      updateField("accentColor", preset.accentColor);
                    }}
                    className={`flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-bold transition ${
                      active
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <span
                      className="h-6 w-6 rounded-full border border-white/70 shadow-inner"
                      style={{
                        background: `linear-gradient(135deg, ${preset.brandColor}, ${preset.accentColor})`,
                      }}
                    />
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm font-bold text-slate-700">
              Brand color
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={form.brandColor || "#000000"}
                  onChange={(e) => updateField("brandColor", e.target.value)}
                  className="h-12 w-16 cursor-pointer rounded-2xl border border-slate-200 bg-white p-1"
                />
                <input
                  value={form.brandColor ?? ""}
                  onChange={(e) => updateField("brandColor", e.target.value)}
                  className="h-12 min-w-0 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-3 font-mono text-xs font-semibold outline-none focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
                />
              </div>
            </label>
            <label className="space-y-2 text-sm font-bold text-slate-700">
              Accent color
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={form.accentColor || "#ffffff"}
                  onChange={(e) => updateField("accentColor", e.target.value)}
                  className="h-12 w-16 cursor-pointer rounded-2xl border border-slate-200 bg-white p-1"
                />
                <input
                  value={form.accentColor ?? ""}
                  onChange={(e) => updateField("accentColor", e.target.value)}
                  className="h-12 min-w-0 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-3 font-mono text-xs font-semibold outline-none focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
                />
              </div>
            </label>
          </div>

          <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-6">
            <button
              type="button"
              onClick={saveChanges}
              disabled={!dirty}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Check className="h-4 w-4" aria-hidden />
              Save changes
            </button>
            <button
              type="button"
              onClick={resetChanges}
              disabled={!dirty}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <RotateCcw className="h-4 w-4" aria-hidden />
              Reset
            </button>
          </div>
        </div>
      </div>

      <section className="rounded-[1.75rem] border border-slate-100 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-black uppercase tracking-[0.12em] text-slate-400">
          Catalog
        </h3>
        <p className="mt-2 text-sm font-medium text-slate-600">
          Products in the dashboard are scoped to{" "}
          <span className="font-bold text-slate-900">{activeShop.name}</span>.
          Add or edit inventory from the products page.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href={PATHS.adminProducts}
            className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            Manage products
          </Link>
          <Link
            href={PATHS.builder}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-800 transition hover:bg-white"
          >
            <Sparkles className="h-4 w-4" aria-hidden />
            Open theme studio
          </Link>
        </div>
      </section>
    </div>
  );
}
