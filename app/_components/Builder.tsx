"use client";

import Image from "next/image";
import {
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

type Surface = "builder" | "admin" | "client";
type ProductLayout = "grid" | "editorial";

type ShopTheme = {
  name: string;
  tagline: string;
  announcement: string;
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  heroImage: string;
  layout: ProductLayout;
  radius: number;
  currency: string;
};

type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  inventory: number;
  image: string;
  featured: boolean;
};

type Order = {
  id: string;
  buyerName: string;
  buyerEmail: string;
  total: number;
  itemCount: number;
  createdAt: string;
};

type ProductDraft = Omit<Product, "id" | "featured"> & {
  featured: "yes" | "no";
};

const imageFallback =
  "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1200&q=80";

const defaultTheme: ShopTheme = {
  name: "Nomad Goods",
  tagline: "Everyday pieces with a Mongolian point of view.",
  announcement: "Free delivery in Ulaanbaatar this week",
  primaryColor: "#047857",
  accentColor: "#f97316",
  backgroundColor: "#f8fafc",
  textColor: "#18181b",
  heroImage:
    "https://images.unsplash.com/photo-1523381294911-8d3cead13475?auto=format&fit=crop&w=1600&q=80",
  layout: "grid",
  radius: 6,
  currency: "₮",
};

const defaultProducts: Product[] = [
  {
    id: "cashmere-cardigan",
    name: "Cashmere Cardigan",
    category: "Apparel",
    description: "Soft midweight knit for cold mornings and clean layering.",
    price: 189000,
    inventory: 14,
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80",
    featured: true,
  },
  {
    id: "leather-tote",
    name: "Leather Tote",
    category: "Accessories",
    description: "Structured carryall with room for a laptop and daily kit.",
    price: 149000,
    inventory: 8,
    image:
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=80",
    featured: true,
  },
  {
    id: "wool-scarf",
    name: "Wool Scarf",
    category: "Seasonal",
    description: "Warm woven texture in a simple, giftable size.",
    price: 69000,
    inventory: 22,
    image:
      "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=1000&q=80",
    featured: false,
  },
];

const emptyDraft: ProductDraft = {
  name: "",
  category: "New",
  description: "",
  price: 99000,
  inventory: 10,
  image: imageFallback,
  featured: "yes",
};

export const Builder = () => {
  const [surface, setSurface] = useState<Surface>("builder");
  const [theme, setTheme] = useState(defaultTheme);
  const [products, setProducts] = useState(defaultProducts);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [draft, setDraft] = useState<ProductDraft>(emptyDraft);
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [lastOrderId, setLastOrderId] = useState("");

  const cartItems = useMemo(
    () =>
      products
        .map((product) => ({
          product,
          quantity: cart[product.id] ?? 0,
        }))
        .filter((item) => item.quantity > 0),
    [cart, products],
  );

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  const inStockProducts = products.filter((product) => product.inventory > 0);
  const featuredProducts = products.filter((product) => product.featured);

  function updateTheme<K extends keyof ShopTheme>(key: K, value: ShopTheme[K]) {
    setTheme((current) => ({ ...current, [key]: value }));
  }

  function addProduct() {
    if (!draft.name.trim()) {
      return;
    }

    const nextProduct: Product = {
      id: `${draft.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`,
      name: draft.name.trim(),
      category: draft.category.trim() || "New",
      description: draft.description.trim() || "Fresh product from the admin.",
      price: Number(draft.price) || 0,
      inventory: Number(draft.inventory) || 0,
      image: safeImage(draft.image),
      featured: draft.featured === "yes",
    };

    setProducts((current) => [nextProduct, ...current]);
    setDraft(emptyDraft);
  }

  function updateInventory(productId: string, amount: number) {
    setProducts((current) =>
      current.map((product) =>
        product.id === productId
          ? { ...product, inventory: Math.max(0, product.inventory + amount) }
          : product,
      ),
    );
  }

  function toggleFeatured(productId: string) {
    setProducts((current) =>
      current.map((product) =>
        product.id === productId
          ? { ...product, featured: !product.featured }
          : product,
      ),
    );
  }

  function addToCart(productId: string) {
    const product = products.find((item) => item.id === productId);

    if (!product || product.inventory <= (cart[productId] ?? 0)) {
      return;
    }

    setCart((current) => ({
      ...current,
      [productId]: (current[productId] ?? 0) + 1,
    }));
  }

  function removeFromCart(productId: string) {
    setCart((current) => {
      const nextQuantity = (current[productId] ?? 0) - 1;
      const nextCart = { ...current };

      if (nextQuantity > 0) {
        nextCart[productId] = nextQuantity;
      } else {
        delete nextCart[productId];
      }

      return nextCart;
    });
  }

  function checkout() {
    if (cartItems.length === 0 || !buyerName.trim()) {
      return;
    }

    const orderId = `ORD-${Date.now().toString().slice(-6)}`;
    const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    setProducts((current) =>
      current.map((product) => {
        const quantity = cart[product.id] ?? 0;

        return quantity > 0
          ? { ...product, inventory: Math.max(0, product.inventory - quantity) }
          : product;
      }),
    );
    setOrders((current) => [
      {
        id: orderId,
        buyerName: buyerName.trim(),
        buyerEmail: buyerEmail.trim() || "No email",
        total: cartTotal,
        itemCount,
        createdAt: new Date().toLocaleString(),
      },
      ...current,
    ]);
    setCart({});
    setBuyerName("");
    setBuyerEmail("");
    setLastOrderId(orderId);
  }

  return (
    <main
      className="min-h-screen px-4 py-5 text-zinc-950 sm:px-6 lg:px-8"
      style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-black/10 pb-4">
          <div>
            <p className="text-sm font-medium" style={{ color: theme.primaryColor }}>
              Shop builder
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-normal sm:text-4xl">
              {theme.name}
            </h1>
          </div>

          <nav className="flex rounded border border-black/10 bg-white p-1 shadow-sm">
            {(["builder", "admin", "client"] as Surface[]).map((item) => (
              <button
                className="rounded px-3 py-2 text-sm font-medium capitalize transition"
                key={item}
                onClick={() => setSurface(item)}
                style={
                  surface === item
                    ? { backgroundColor: theme.primaryColor, color: "#ffffff" }
                    : { color: "#3f3f46" }
                }
                type="button"
              >
                {item}
              </button>
            ))}
          </nav>
        </header>

        <section className="grid gap-3 sm:grid-cols-3">
          <Metric label="Products" value={products.length.toString()} />
          <Metric label="In stock" value={inStockProducts.length.toString()} />
          <Metric label="Orders" value={orders.length.toString()} />
        </section>

        {surface === "builder" && (
          <BuilderSurface
            featuredProducts={featuredProducts}
            theme={theme}
            updateTheme={updateTheme}
          />
        )}

        {surface === "admin" && (
          <AdminSurface
            addProduct={addProduct}
            draft={draft}
            orders={orders}
            products={products}
            setDraft={setDraft}
            theme={theme}
            toggleFeatured={toggleFeatured}
            updateInventory={updateInventory}
          />
        )}

        {surface === "client" && (
          <ClientSurface
            addToCart={addToCart}
            buyerEmail={buyerEmail}
            buyerName={buyerName}
            cartItems={cartItems}
            cartTotal={cartTotal}
            checkout={checkout}
            lastOrderId={lastOrderId}
            products={products}
            removeFromCart={removeFromCart}
            setBuyerEmail={setBuyerEmail}
            setBuyerName={setBuyerName}
            theme={theme}
          />
        )}
      </div>
    </main>
  );
};

function BuilderSurface({
  featuredProducts,
  theme,
  updateTheme,
}: {
  featuredProducts: Product[];
  theme: ShopTheme;
  updateTheme: <K extends keyof ShopTheme>(key: K, value: ShopTheme[K]) => void;
}) {
  return (
    <section className="grid gap-5 lg:grid-cols-[360px_1fr]">
      <div className="h-fit rounded-md border border-black/10 bg-white p-4 shadow-sm">
        <h2 className="text-base font-semibold tracking-normal">Theme controls</h2>
        <div className="mt-4 grid gap-4">
          <Field label="Shop name">
            <input
              className="input"
              onChange={(event) => updateTheme("name", event.target.value)}
              value={theme.name}
            />
          </Field>
          <Field label="Tagline">
            <textarea
              className="input min-h-20 resize-none"
              onChange={(event) => updateTheme("tagline", event.target.value)}
              value={theme.tagline}
            />
          </Field>
          <Field label="Announcement">
            <input
              className="input"
              onChange={(event) => updateTheme("announcement", event.target.value)}
              value={theme.announcement}
            />
          </Field>
          <Field label="Hero image">
            <input
              className="input"
              onChange={(event) =>
                updateTheme("heroImage", event.target.value)
              }
              value={theme.heroImage}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <ColorField
              label="Primary"
              onChange={(value) => updateTheme("primaryColor", value)}
              value={theme.primaryColor}
            />
            <ColorField
              label="Accent"
              onChange={(value) => updateTheme("accentColor", value)}
              value={theme.accentColor}
            />
            <ColorField
              label="Background"
              onChange={(value) => updateTheme("backgroundColor", value)}
              value={theme.backgroundColor}
            />
            <ColorField
              label="Text"
              onChange={(value) => updateTheme("textColor", value)}
              value={theme.textColor}
            />
          </div>

          <Field label="Product layout">
            <select
              className="input"
              onChange={(event) =>
                updateTheme("layout", event.target.value as ProductLayout)
              }
              value={theme.layout}
            >
              <option value="grid">Grid</option>
              <option value="editorial">Editorial</option>
            </select>
          </Field>

          <Field label={`Corner radius ${theme.radius}px`}>
            <input
              max="8"
              min="0"
              onChange={(event) => updateTheme("radius", Number(event.target.value))}
              type="range"
              value={theme.radius}
            />
          </Field>
        </div>
      </div>

      <div className="overflow-hidden rounded-md border border-black/10 bg-white shadow-sm">
        <ShopHero theme={theme} />
        <ProductShelf
          mode="preview"
          products={featuredProducts.length > 0 ? featuredProducts : []}
          theme={theme}
        />
      </div>
    </section>
  );
}

function AdminSurface({
  addProduct,
  draft,
  orders,
  products,
  setDraft,
  theme,
  toggleFeatured,
  updateInventory,
}: {
  addProduct: () => void;
  draft: ProductDraft;
  orders: Order[];
  products: Product[];
  setDraft: Dispatch<SetStateAction<ProductDraft>>;
  theme: ShopTheme;
  toggleFeatured: (productId: string) => void;
  updateInventory: (productId: string, amount: number) => void;
}) {
  return (
    <section className="grid gap-5 lg:grid-cols-[380px_1fr]">
      <div className="h-fit rounded-md border border-black/10 bg-white p-4 shadow-sm">
        <h2 className="text-base font-semibold tracking-normal">Create item</h2>
        <div className="mt-4 grid gap-4">
          <Field label="Name">
            <input
              className="input"
              onChange={(event) =>
                setDraft((current) => ({ ...current, name: event.target.value }))
              }
              value={draft.name}
            />
          </Field>
          <Field label="Category">
            <input
              className="input"
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  category: event.target.value,
                }))
              }
              value={draft.category}
            />
          </Field>
          <Field label="Description">
            <textarea
              className="input min-h-20 resize-none"
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              value={draft.description}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Price">
              <input
                className="input"
                min="0"
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    price: Number(event.target.value),
                  }))
                }
                type="number"
                value={draft.price}
              />
            </Field>
            <Field label="Inventory">
              <input
                className="input"
                min="0"
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    inventory: Number(event.target.value),
                  }))
                }
                type="number"
                value={draft.inventory}
              />
            </Field>
          </div>
          <Field label="Image URL">
            <input
              className="input"
              onChange={(event) =>
                setDraft((current) => ({ ...current, image: event.target.value }))
              }
              value={draft.image}
            />
          </Field>
          <Field label="Featured">
            <select
              className="input"
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  featured: event.target.value as ProductDraft["featured"],
                }))
              }
              value={draft.featured}
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </Field>
          <button
            className="rounded-md px-3 py-2 text-sm font-semibold text-white"
            onClick={addProduct}
            style={{ backgroundColor: theme.primaryColor }}
            type="button"
          >
            Add product
          </button>
        </div>
      </div>

      <div className="grid gap-5">
        <div className="rounded-md border border-black/10 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-zinc-200 pb-3">
            <h2 className="text-base font-semibold tracking-normal">Products</h2>
            <span className="text-sm text-zinc-500">{products.length} active</span>
          </div>
          <div className="mt-4 grid gap-3">
            {products.map((product) => (
              <div
                className="grid gap-3 rounded-md border border-zinc-200 p-3 sm:grid-cols-[72px_1fr_auto]"
                key={product.id}
              >
                <ProductImage product={product} radius={theme.radius} />
                <div>
                  <p className="text-sm font-semibold">{product.name}</p>
                  <p className="mt-1 text-sm text-zinc-500">{product.category}</p>
                  <p className="mt-2 text-sm">{formatMoney(product.price, theme.currency)}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                  <button
                    className="control-button"
                    onClick={() => updateInventory(product.id, -1)}
                    type="button"
                  >
                    -
                  </button>
                  <span className="min-w-10 text-center text-sm font-medium">
                    {product.inventory}
                  </span>
                  <button
                    className="control-button"
                    onClick={() => updateInventory(product.id, 1)}
                    type="button"
                  >
                    +
                  </button>
                  <button
                    className="control-button"
                    onClick={() => toggleFeatured(product.id)}
                    type="button"
                  >
                    {product.featured ? "Featured" : "Feature"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-md border border-black/10 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-zinc-200 pb-3">
            <h2 className="text-base font-semibold tracking-normal">Orders</h2>
            <span className="text-sm text-zinc-500">{orders.length} total</span>
          </div>
          <div className="mt-4 grid gap-3">
            {orders.length > 0 ? (
              orders.map((order) => (
                <div
                  className="grid gap-2 rounded-md border border-zinc-200 p-3 text-sm sm:grid-cols-[1fr_auto]"
                  key={order.id}
                >
                  <div>
                    <p className="font-semibold">{order.id}</p>
                    <p className="mt-1 text-zinc-500">
                      {order.buyerName} · {order.buyerEmail}
                    </p>
                    <p className="mt-1 text-zinc-500">{order.createdAt}</p>
                  </div>
                  <div className="sm:text-right">
                    <p className="font-semibold">
                      {formatMoney(order.total, theme.currency)}
                    </p>
                    <p className="mt-1 text-zinc-500">{order.itemCount} items</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-zinc-500">Orders appear after checkout.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function ClientSurface({
  addToCart,
  buyerEmail,
  buyerName,
  cartItems,
  cartTotal,
  checkout,
  lastOrderId,
  products,
  removeFromCart,
  setBuyerEmail,
  setBuyerName,
  theme,
}: {
  addToCart: (productId: string) => void;
  buyerEmail: string;
  buyerName: string;
  cartItems: { product: Product; quantity: number }[];
  cartTotal: number;
  checkout: () => void;
  lastOrderId: string;
  products: Product[];
  removeFromCart: (productId: string) => void;
  setBuyerEmail: Dispatch<SetStateAction<string>>;
  setBuyerName: Dispatch<SetStateAction<string>>;
  theme: ShopTheme;
}) {
  return (
    <section className="grid gap-5 xl:grid-cols-[1fr_360px]">
      <div className="overflow-hidden rounded-md border border-black/10 bg-white shadow-sm">
        <ShopHero theme={theme} />
        <ProductShelf
          addToCart={addToCart}
          mode="shop"
          products={products}
          theme={theme}
        />
      </div>

      <aside className="h-fit rounded-md border border-black/10 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-zinc-200 pb-3">
          <h2 className="text-base font-semibold tracking-normal">Cart</h2>
          <span className="rounded bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700">
            {cartItems.reduce((total, item) => total + item.quantity, 0)}
          </span>
        </div>

        <div className="mt-4 grid gap-3">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div
                className="grid gap-3 rounded-md border border-zinc-200 p-3 text-sm"
                key={item.product.id}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{item.product.name}</p>
                    <p className="mt-1 text-zinc-500">
                      {item.quantity} x {formatMoney(item.product.price, theme.currency)}
                    </p>
                  </div>
                  <button
                    className="control-button"
                    onClick={() => removeFromCart(item.product.id)}
                    type="button"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-zinc-500">Your selected products show here.</p>
          )}
        </div>

        <div className="mt-4 border-t border-zinc-200 pt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-500">Total</span>
            <strong>{formatMoney(cartTotal, theme.currency)}</strong>
          </div>

          <div className="mt-4 grid gap-3">
            <Field label="Name">
              <input
                className="input"
                onChange={(event) => setBuyerName(event.target.value)}
                value={buyerName}
              />
            </Field>
            <Field label="Email">
              <input
                className="input"
                onChange={(event) => setBuyerEmail(event.target.value)}
                type="email"
                value={buyerEmail}
              />
            </Field>
            <button
              className="rounded-md px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
              disabled={cartItems.length === 0 || !buyerName.trim()}
              onClick={checkout}
              style={{ backgroundColor: theme.primaryColor }}
              type="button"
            >
              Buy cart
            </button>
          </div>

          {lastOrderId && (
            <p className="mt-3 rounded-md bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800">
              Order {lastOrderId} placed.
            </p>
          )}
        </div>
      </aside>
    </section>
  );
}

function ShopHero({ theme }: { theme: ShopTheme }) {
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
        <p className="mb-3 w-fit rounded-md bg-white/15 px-3 py-2 text-sm font-medium backdrop-blur">
          {theme.announcement}
        </p>
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

function ProductShelf({
  addToCart,
  mode,
  products,
  theme,
}: {
  addToCart?: (productId: string) => void;
  mode: "preview" | "shop";
  products: Product[];
  theme: ShopTheme;
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
          <h3 className="mt-1 text-xl font-semibold tracking-normal">Products</h3>
        </div>
        <span className="text-sm text-zinc-500">{products.length} items</span>
      </div>

      {products.length > 0 ? (
        <div className={layoutClass}>
          {products.map((product) => (
            <article
              className="overflow-hidden border border-zinc-200 bg-white shadow-sm"
              key={product.id}
              style={{ borderRadius: theme.radius }}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
                <Image
                  alt={product.name}
                  className="object-cover"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  src={safeImage(product.image)}
                />
              </div>
              <div className="p-4">
                <p className="text-sm text-zinc-500">{product.category}</p>
                <h4 className="mt-1 text-base font-semibold tracking-normal">
                  {product.name}
                </h4>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  {product.description}
                </p>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">
                      {formatMoney(product.price, theme.currency)}
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {product.inventory} in stock
                    </p>
                  </div>
                  {mode === "shop" && (
                    <button
                      className="rounded-md px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={product.inventory === 0}
                      onClick={() => addToCart?.(product.id)}
                      style={{ backgroundColor: theme.primaryColor }}
                      type="button"
                    >
                      Add
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="rounded-md border border-zinc-200 p-4 text-sm text-zinc-500">
          Add products in admin to fill this shelf.
        </p>
      )}
    </section>
  );
}

function ProductImage({ product, radius }: { product: Product; radius: number }) {
  return (
    <div
      className="relative h-[72px] min-h-[72px] w-[72px] overflow-hidden bg-zinc-100"
      style={{ borderRadius: radius }}
    >
      <Image
        alt={product.name}
        className="object-cover"
        fill
        sizes="72px"
        src={safeImage(product.image)}
      />
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-black/10 bg-white p-4 shadow-sm">
      <p className="text-sm text-zinc-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-normal">{value}</p>
    </div>
  );
}

function Field({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <label className="grid gap-1.5 text-sm font-medium text-zinc-700">
      <span>{label}</span>
      {children}
    </label>
  );
}

function ColorField({
  label,
  onChange,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <label className="grid gap-1.5 text-sm font-medium text-zinc-700">
      <span>{label}</span>
      <input
        className="h-10 w-full rounded-md border border-zinc-300 bg-white p-1"
        onChange={(event) => onChange(event.target.value)}
        type="color"
        value={value}
      />
    </label>
  );
}

function formatMoney(value: number, currency: string) {
  const formatted = new Intl.NumberFormat("en-US").format(value);

  return currency === "₮" ? `${formatted} ₮` : `${currency}${formatted}`;
}

function safeImage(url: string) {
  return url.startsWith("https://images.unsplash.com/") ? url : imageFallback;
}
