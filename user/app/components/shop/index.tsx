import Image from "next/image";
import type { Product, ShopTheme } from "@/types";
import { safeImage, formatMoney } from "@/lib/utils";

export function ShopHero({ theme }: { theme: ShopTheme }) {
  return (
    <section className="relative min-h-[280px] overflow-hidden p-5 sm:p-8">
      <Image
        alt={theme.name}
        className="object-cover"
        fill
        priority
        sizes="(max-width: 1280px) 100vw, 896px"
        src={safeImage(theme.heroImage)}
      />
      <div className="absolute inset-0 bg-black/45" />
      <div className="relative flex min-h-[220px] max-w-2xl flex-col justify-end text-white">
        {theme.announcement && (
          <p className="mb-3 w-fit rounded-md bg-white/15 px-3 py-2 text-sm font-medium backdrop-blur">
            {theme.announcement}
          </p>
        )}
        <h2 className="text-3xl font-semibold tracking-normal sm:text-5xl">
          {theme.name}
        </h2>
        <p className="mt-4 max-w-xl text-base leading-7 text-white/85">
          {theme.tagline}
        </p>
      </div>
    </section>
  );
}

export function ProductCard({
  product,
  theme,
  mode,
  onAdd,
}: {
  product: Product;
  theme: ShopTheme;
  mode: "preview" | "shop";
  onAdd?: () => void;
}) {
  const effectivePrice = product.salePrice ?? product.price;
  const isOutOfStock = product.inventory === 0;
  const isLowStock = product.inventory > 0 && product.inventory < 5;

  return (
    <article
      className="overflow-hidden border border-zinc-200 bg-white shadow-sm"
      style={{ borderRadius: theme.radius }}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
        <Image
          alt={product.name}
          className="object-cover transition-transform duration-500 hover:scale-105"
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
          src={safeImage(product.image)}
        />
        {product.salePrice && (
          <div
            className="absolute left-3 top-3 rounded px-2 py-0.5 text-xs font-bold text-white"
            style={{ backgroundColor: theme.accentColor }}
          >
            SALE
          </div>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[1px]">
            <span className="rounded bg-white/90 px-3 py-1 text-sm font-semibold text-zinc-700">
              Out of stock
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
          {product.category}
        </p>
        <h4 className="mt-1 text-base font-semibold tracking-normal">{product.name}</h4>
        <p className="mt-1.5 text-sm leading-6 text-zinc-500">{product.description}</p>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold">
                {formatMoney(effectivePrice, theme.currency)}
              </p>
              {product.salePrice && (
                <p className="text-xs text-zinc-400 line-through">
                  {formatMoney(product.price, theme.currency)}
                </p>
              )}
            </div>
            {isLowStock && (
              <p className="mt-0.5 text-xs text-amber-600">Only {product.inventory} left</p>
            )}
          </div>

          {mode === "shop" && (
            <button
              className="rounded-md px-3 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={isOutOfStock}
              onClick={onAdd}
              style={{ backgroundColor: theme.primaryColor }}
              type="button"
            >
              Add
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export function ProductShelf({
  addToCart,
  mode,
  products,
  theme,
  title = "Products",
}: {
  addToCart?: (productId: string) => void;
  mode: "preview" | "shop";
  products: Product[];
  theme: ShopTheme;
  title?: string;
}) {
  const layoutClass =
    theme.layout === "editorial"
      ? "grid gap-4 md:grid-cols-2"
      : "grid gap-4 sm:grid-cols-2 xl:grid-cols-3";

  return (
    <section className="p-4 sm:p-5">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-sm font-medium" style={{ color: theme.primaryColor }}>
            Collection
          </p>
          <h3 className="mt-1 text-xl font-semibold tracking-normal">{title}</h3>
        </div>
        <span className="text-sm text-zinc-400">{products.length} items</span>
      </div>

      {products.length > 0 ? (
        <div className={layoutClass}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              mode={mode}
              onAdd={() => addToCart?.(product.id)}
              product={product}
              theme={theme}
            />
          ))}
        </div>
      ) : (
        <p className="rounded-md border border-zinc-100 p-4 text-sm text-zinc-400">
          {mode === "preview"
            ? "Feature products in admin to preview them here."
            : "No products match your filter."}
        </p>
      )}
    </section>
  );
}