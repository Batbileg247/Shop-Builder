import { Field, ColorField } from "@/ui";
import { ShopHero, ProductShelf } from "@/app/components/shop";
import { Product, ShopTheme } from "@/types";

const CURRENCIES = ["₮", "$", "€", "£", "¥"] as const;
const FONTS = [
  { label: "System sans-serif", value: "sans" },
  { label: "Serif", value: "serif" },
  { label: "Monospace", value: "mono" },
] as const;

type Props = {
  featuredProducts: Product[];
  theme: ShopTheme;
  updateTheme: <K extends keyof ShopTheme>(key: K, value: ShopTheme[K]) => void;
};

export function BuilderSurface({
  featuredProducts,
  theme,
  updateTheme,
}: Props) {
  return (
    <section className="grid gap-5 lg:grid-cols-[360px_1fr]">
      {/* Controls */}
      <div className="h-fit rounded-md border border-black/10 bg-white p-4 shadow-sm">
        <h2 className="text-base font-semibold">Theme controls</h2>

        <div className="mt-4 grid gap-4">
          {/* Identity */}
          <div className="border-b border-zinc-100 pb-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Identity
            </p>
            <div className="grid gap-3">
              <Field label="Shop name">
                <input
                  className="input"
                  onChange={(e) => updateTheme("name", e.target.value)}
                  value={theme.name}
                />
              </Field>
              <Field label="Tagline">
                <textarea
                  className="input min-h-16 resize-none"
                  onChange={(e) => updateTheme("tagline", e.target.value)}
                  value={theme.tagline}
                />
              </Field>
              <Field label="Announcement bar">
                <input
                  className="input"
                  onChange={(e) => updateTheme("announcement", e.target.value)}
                  value={theme.announcement}
                />
              </Field>
            </div>
          </div>

          {/* Media */}
          <div className="border-b border-zinc-100 pb-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Media
            </p>
            <Field label="Hero image (Unsplash URL)">
              <input
                className="input"
                onChange={(e) => updateTheme("heroImage", e.target.value)}
                value={theme.heroImage}
              />
            </Field>
          </div>

          {/* Colors */}
          <div className="border-b border-zinc-100 pb-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Colors
            </p>
            <div className="grid grid-cols-2 gap-3">
              <ColorField
                label="Primary"
                onChange={(v) => updateTheme("primaryColor", v)}
                value={theme.primaryColor}
              />
              <ColorField
                label="Accent"
                onChange={(v) => updateTheme("accentColor", v)}
                value={theme.accentColor}
              />
              <ColorField
                label="Background"
                onChange={(v) => updateTheme("backgroundColor", v)}
                value={theme.backgroundColor}
              />
              <ColorField
                label="Text"
                onChange={(v) => updateTheme("textColor", v)}
                value={theme.textColor}
              />
            </div>
          </div>

          {/* Style */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Style
            </p>
            <div className="grid gap-3">
              <Field label="Product layout">
                <select
                  className="input"
                  onChange={(e) =>
                    updateTheme("layout", e.target.value as ShopTheme["layout"])
                  }
                  value={theme.layout}
                >
                  <option value="grid">Grid</option>
                  <option value="editorial">Editorial</option>
                </select>
              </Field>

              <Field label="Font family">
                <select
                  className="input"
                  onChange={(e) => updateTheme("font", e.target.value)}
                  value={theme.font}
                >
                  {FONTS.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label={`Corner radius — ${theme.radius}px`}>
                <input
                  className="w-full accent-current"
                  max="20"
                  min="0"
                  onChange={(e) =>
                    updateTheme("radius", Number(e.target.value))
                  }
                  style={{ accentColor: theme.primaryColor }}
                  type="range"
                  value={theme.radius}
                />
              </Field>

              <Field label="Currency">
                <div className="flex gap-2">
                  {CURRENCIES.map((c) => (
                    <button
                      className="flex-1 rounded-md border py-2 text-sm font-semibold transition"
                      key={c}
                      onClick={() => updateTheme("currency", c)}
                      style={
                        theme.currency === c
                          ? {
                              backgroundColor: theme.primaryColor,
                              color: "#fff",
                              borderColor: theme.primaryColor,
                            }
                          : { borderColor: "#d4d4d8", color: "#52525b" }
                      }
                      type="button"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </Field>
            </div>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="overflow-hidden rounded-md border border-black/10 bg-white shadow-sm">
        <ShopHero theme={theme} />
        <ProductShelf
          mode="preview"
          products={featuredProducts}
          theme={theme}
          title="Featured"
        />
      </div>
    </section>
  );
}
