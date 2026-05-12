"use client";

import { useMemo, useState } from "react";
import type {
  CartItem,
  Order,
  OrderStatus,
  Product,
  ProductDraft,
  ShopTheme,
  Surface,
} from "@/types";
import { defaultProducts, defaultTheme, emptyDraft } from "@/lib/defaults";
import { safeImage, slugify } from "@/lib/utils";

export function useShop() {
  const [surface, setSurface] = useState<Surface>("builder");
  const [theme, setTheme] = useState<ShopTheme>(defaultTheme);
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [draft, setDraft] = useState<ProductDraft>(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [lastOrderId, setLastOrderId] = useState("");

  // ─── Derived ────────────────────────────────────────────────────────────────

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

  // ─── Theme ──────────────────────────────────────────────────────────────────

  function updateTheme<K extends keyof ShopTheme>(key: K, value: ShopTheme[K]) {
    setTheme((t) => ({ ...t, [key]: value }));
  }

  // ─── Products ────────────────────────────────────────────────────────────────

  function addProduct() {
    if (!draft.name.trim()) return;

    const next: Product = {
      id: `${slugify(draft.name)}-${Date.now()}`,
      name: draft.name.trim(),
      category: draft.category.trim() || "General",
      description: draft.description.trim() || "",
      price: Number(draft.price) || 0,
      salePrice: draft.salePrice ? Number(draft.salePrice) : undefined,
      inventory: Number(draft.inventory) || 0,
      image: safeImage(draft.image),
      featured: draft.featured === "yes",
    };

    setProducts((prev) => [next, ...prev]);
    setDraft(emptyDraft);
  }

  function saveEdit(id: string) {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              name: draft.name.trim() || p.name,
              category: draft.category.trim() || p.category,
              description: draft.description.trim(),
              price: Number(draft.price) || p.price,
              salePrice: draft.salePrice ? Number(draft.salePrice) : undefined,
              inventory: Number(draft.inventory),
              image: safeImage(draft.image),
              featured: draft.featured === "yes",
            }
          : p,
      ),
    );
    setEditingId(null);
    setDraft(emptyDraft);
  }

  function startEdit(product: Product) {
    setEditingId(product.id);
    setDraft({
      name: product.name,
      category: product.category,
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

  // ─── Cart ────────────────────────────────────────────────────────────────────

  function addToCart(id: string) {
    const product = products.find((p) => p.id === id);
    if (!product || product.inventory <= (cart[id] ?? 0)) return;
    setCart((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
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

  // ─── Orders ──────────────────────────────────────────────────────────────────

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

  function updateOrderStatus(id: string, status: OrderStatus) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  }

  return {
    // state
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
    // derived
    inStockProducts,
    featuredProducts,
    // actions
    addProduct,
    saveEdit,
    startEdit,
    cancelEdit,
    deleteProduct,
    updateInventory,
    toggleFeatured,
    addToCart,
    removeFromCart,
    clearCartItem,
    checkout,
    updateOrderStatus,
  };
}
