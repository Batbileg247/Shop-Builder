"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  CartItem,
  Order,
  OrderStatus,
  Product,
  ProductDraft,
  ShopTheme,
  Surface,
} from "@/types";
import {
  buildCatalogFilterDefinitions,
  defaultTheme,
  emptyDraft,
} from "@/lib/defaults";
import { safeImage, slugify } from "@/lib/utils";

const ShopContext = createContext<ReturnType<typeof useShopState> | null>(null);

export function ShopProvider({ children }: { children: ReactNode }) {
  const value = useShopState();
  return (
    <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
  );
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) {
    throw new Error("useShop must be used within ShopProvider");
  }
  return ctx;
}

function useShopState() {
  const [surface, setSurface] = useState<Surface>("builder");
  const [theme, setTheme] = useState<ShopTheme>(defaultTheme);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [draft, setDraft] = useState<ProductDraft>(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [lastOrderId, setLastOrderId] = useState("");
  const [categories, setCategories] = useState<string[]>([]);

  const catalogFilterDefinitions = useMemo(
    () => buildCatalogFilterDefinitions(categories),
    [categories],
  );

  const cartItems: CartItem[] = useMemo(
    () =>
      products
        .map((product) => ({ product, quantity: cart[product.id] ?? 0 }))
        .filter((item) => item.quantity > 0),
    [cart, products],
  );

  const cartTotal = cartItems.reduce(
    (sum, item) =>
      sum + (item.product.salePrice ?? item.product.price) * item.quantity,
    0,
  );

  const inStockProducts = products.filter((p) => p.inventory > 0);
  const featuredProducts = products.filter((p) => p.featured);

  function updateTheme<K extends keyof ShopTheme>(key: K, value: ShopTheme[K]) {
    setTheme((t) => ({ ...t, [key]: value }));
  }

  function addCategory(name: string) {
    const n = name.trim();
    if (!n) return;
    setCategories((prev) => (prev.includes(n) ? prev : [...prev, n].sort((a, b) => a.localeCompare(b))));
  }

  function removeCategory(name: string) {
    const n = name.trim();
    if (!n) return;
    setCategories((prev) => prev.filter((c) => c !== n));
  }

  function ensureCategoryListed(category: string) {
    const c = category.trim();
    if (!c) return;
    setCategories((prev) =>
      prev.includes(c) ? prev : [...prev, c].sort((a, b) => a.localeCompare(b)),
    );
  }

  function addProduct(overrideDraft?: ProductDraft) {
    const d = overrideDraft ?? draft;
    if (!d.name.trim() || !d.image.trim()) return;

    const category = d.category.trim() || "Uncategorized";
    ensureCategoryListed(category);

    const next: Product = {
      id: `${slugify(d.name)}-${Date.now()}`,
      name: d.name.trim(),
      category,
      size: d.size.trim(),
      description: d.description.trim() || "",
      price: Number(d.price) || 0,
      salePrice: d.salePrice ? Number(d.salePrice) : undefined,
      inventory: Number(d.inventory) || 0,
      image: safeImage(d.image.trim()),
      featured: d.featured === "yes",
    };

    setProducts((prev) => [next, ...prev]);
    setDraft(emptyDraft);
  }

  function saveEdit(id: string) {
    const existing = products.find((p) => p.id === id);
    if (!existing) return;
    const category = draft.category.trim() || existing.category;
    ensureCategoryListed(category);

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        return {
          ...p,
          name: draft.name.trim() || p.name,
          category,
          size: draft.size.trim(),
          description: draft.description.trim(),
          price: Number(draft.price) || p.price,
          salePrice: draft.salePrice ? Number(draft.salePrice) : undefined,
          inventory: Number(draft.inventory),
          image: safeImage(draft.image.trim()),
          featured: draft.featured === "yes",
        };
      }),
    );
    setEditingId(null);
    setDraft(emptyDraft);
  }

  function startEdit(product: Product) {
    setEditingId(product.id);
    setDraft({
      name: product.name,
      category: product.category,
      size: product.size,
      description: product.description,
      price: product.price,
      salePrice: product.salePrice?.toString() ?? "",
      inventory: product.inventory,
      image: product.image,
      featured: product.featured ? "yes" : "no",
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setDraft(emptyDraft);
  }

  function deleteProduct(id: string) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCart((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  function updateInventory(id: string, delta: number) {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, inventory: Math.max(0, p.inventory + delta) } : p,
      ),
    );
  }

  function toggleFeatured(id: string) {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p)),
    );
  }

  function addToCart(id: string) {
    const product = products.find((p) => p.id === id);
    if (!product || product.inventory <= (cart[id] ?? 0)) return;
    setCart((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
  }

  function addQuantityToCart(id: string, amount: number) {
    if (amount <= 0) return;
    const product = products.find((p) => p.id === id);
    if (!product) return;
    setCart((prev) => {
      const current = prev[id] ?? 0;
      const nextQty = Math.min(current + amount, product.inventory);
      if (nextQty <= current) return prev;
      return { ...prev, [id]: nextQty };
    });
  }

  function removeFromCart(id: string) {
    setCart((prev) => {
      const next = { ...prev };
      const qty = (next[id] ?? 0) - 1;
      if (qty > 0) next[id] = qty;
      else delete next[id];
      return next;
    });
  }

  function clearCartItem(id: string) {
    setCart((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  function checkout() {
    if (cartItems.length === 0 || !buyerName.trim()) return;

    const orderId = `ORD-${Date.now().toString().slice(-6)}`;
    const itemCount = cartItems.reduce((s, i) => s + i.quantity, 0);

    setProducts((prev) =>
      prev.map((p) => {
        const qty = cart[p.id] ?? 0;
        return qty > 0
          ? { ...p, inventory: Math.max(0, p.inventory - qty) }
          : p;
      }),
    );

    setOrders((prev) => [
      {
        id: orderId,
        buyerName: buyerName.trim(),
        buyerEmail: buyerEmail.trim() || "—",
        total: cartTotal,
        itemCount,
        createdAt: new Date().toLocaleString(),
        status: "pending",
      },
      ...prev,
    ]);

    setCart({});
    setBuyerName("");
    setBuyerEmail("");
    setLastOrderId(orderId);
  }

  function clearLastOrder() {
    setLastOrderId("");
  }

  function updateOrderStatus(id: string, status: OrderStatus) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  }

  return {
    surface,
    setSurface,
    theme,
    updateTheme,
    products,
    orders,
    cart,
    cartItems,
    cartTotal,
    draft,
    setDraft,
    editingId,
    buyerName,
    setBuyerName,
    buyerEmail,
    setBuyerEmail,
    lastOrderId,
    catalogFilterDefinitions,
    categories,
    addCategory,
    removeCategory,
    inStockProducts,
    featuredProducts,
    addProduct,
    saveEdit,
    startEdit,
    cancelEdit,
    deleteProduct,
    updateInventory,
    toggleFeatured,
    addToCart,
    addQuantityToCart,
    removeFromCart,
    clearCartItem,
    checkout,
    clearLastOrder,
    updateOrderStatus,
  };
}
