"use client";

import * as React from "react";
import Image from "next/image";
import { Check, ExternalLink, RotateCcw } from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";
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
  const previewLogo = form.logoUrl || activeShop.logoUrl;
  const previewBrand = form.brandColor || activeShop.brandColor;
  const previewAccent = form.accentColor || activeShop.accentColor;

  return (
    <div className="grid gap-8 xl:grid-cols-[380px_minmax(0,1fr)]">
      <aside className="rounded-[2rem] bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.07)]">
        <p className="text-sm font-bold text-slate-400">Re-customize</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">
          Current shop
        </h1>
        <p className="mt-3 text-sm font-medium leading-6 text-slate-400">
          Change the selected shop details and visual identity from the admin
          panel, similar to the builder controls.
        </p>

        <div className="mt-7 space-y-5">
          <label className="space-y-2 text-sm font-bold text-slate-500">
            Shop name
            <input
              value={form.name ?? ""}
              onChange={(event) => {
                updateField("name", event.target.value);
                updateField("slug", slugify(event.target.value));
              }}
              className="h-12 w-full rounded-2xl border border-slate-100 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none focus:bg-white"
            />
          </label>

          <label className="space-y-2 text-sm font-bold text-slate-500">
            Slug
            <input
              value={form.slug ?? ""}
              onChange={(event) => updateField("slug", slugify(event.target.value))}
              className="h-12 w-full rounded-2xl border border-slate-100 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none focus:bg-white"
            />
          </label>

          <label className="space-y-2 text-sm font-bold text-slate-500">
            Logo image URL
            <input
              value={form.logoUrl ?? ""}
              onChange={(event) => updateField("logoUrl", event.target.value)}
              className="h-12 w-full rounded-2xl border border-slate-100 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none focus:bg-white"
            />
          </label>

          <section>
            <p className="text-sm font-bold text-slate-500">Style preset</p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {presets.map((preset) => {
                const active =
                  form.brandColor === preset.brandColor &&
                  form.accentColor === preset.accentColor;

                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() =>
                      setForm((current) => ({
                        ...current,
                        brandColor: preset.brandColor,
                        accentColor: preset.accentColor,
                      }))
                    }
                    className={`flex items-center gap-3 rounded-2xl border p-3 text-left text-sm font-black transition ${
                      active
                        ? "border-slate-900 bg-white text-slate-950"
                        : "border-slate-100 bg-slate-50 text-slate-500"
                    }`}
                  >
                    <span
                      className="h-7 w-7 rounded-xl"
                      style={{ backgroundColor: preset.brandColor }}
                    />
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </section>

          <div className="grid grid-cols-2 gap-3">
            <label className="space-y-2 text-sm font-bold text-slate-500">
              Primary
              <input
                type="color"
                value={previewBrand}
                onChange={(event) =>
                  updateField("brandColor", event.target.value)
                }
                className="h-12 w-full cursor-pointer rounded-2xl border border-slate-100 bg-slate-50 p-1"
              />
            </label>
            <label className="space-y-2 text-sm font-bold text-slate-500">
              Soft accent
              <input
                type="color"
                value={previewAccent}
                onChange={(event) =>
                  updateField("accentColor", event.target.value)
                }
                className="h-12 w-full cursor-pointer rounded-2xl border border-slate-100 bg-slate-50 p-1"
              />
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={resetChanges}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-50 text-sm font-black text-slate-500 transition hover:bg-slate-100"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
            <button
              type="button"
              onClick={saveChanges}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl text-sm font-black text-white shadow-lg transition hover:opacity-90"
              style={{
                backgroundColor: previewBrand,
                boxShadow: `0 18px 34px ${previewBrand}33`,
              }}
            >
              <Check className="h-4 w-4" />
              Save
            </button>
          </div>
        </div>
      </aside>

      <section className="rounded-[2rem] bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.07)] sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold text-slate-400">Live Preview</p>
            <h2 className="mt-2 text-3xl font-black text-slate-950">
              {previewName}
            </h2>
            <p className="mt-2 text-sm font-semibold text-slate-400">
              /{previewSlug}
            </p>
          </div>
          <button
            type="button"
            className="flex h-12 items-center gap-2 rounded-2xl px-5 text-sm font-black text-white"
            style={{ backgroundColor: previewBrand }}
          >
            <ExternalLink className="h-4 w-4" />
            Preview shop
          </button>
        </div>

        <div
          className="mt-8 overflow-hidden rounded-[2rem] p-5"
          style={{ backgroundColor: previewAccent }}
        >
          <div className="rounded-[1.75rem] bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 overflow-hidden rounded-2xl bg-slate-100">
                  <Image
                    src={previewLogo}
                    alt=""
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-xl font-black text-slate-950">
                    {previewName}
                  </p>
                  <p className="text-sm font-semibold text-slate-400">
                    Multi-tenant storefront
                  </p>
                </div>
              </div>
              <div
                className="hidden h-12 rounded-2xl px-5 text-sm font-black text-white sm:flex sm:items-center"
                style={{ backgroundColor: previewBrand }}
              >
                Shop now
              </div>
            </div>

            <div className="mt-7 grid gap-4 sm:grid-cols-3">
              {["Hero", "Products", "Checkout"].map((label, index) => (
                <div key={label} className="rounded-[1.5rem] bg-slate-50 p-4">
                  <div
                    className="h-20 rounded-[1.25rem]"
                    style={{
                      backgroundColor:
                        index === 0 ? previewBrand : previewAccent,
                    }}
                  />
                  <p className="mt-4 font-black text-slate-950">{label}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-400">
                    Editable storefront block
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
