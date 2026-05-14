"use client";

import * as React from "react";
import { ThemeStoreShopPersistenceSync } from "@/context/theme-store-shop-persistence-sync";
import { themePersistenceShopIdRef, useThemeStore } from "@/stores/useThemeStore";
import {
  deleteAdminCategory,
  deleteAdminProduct,
  fetchAdminDashboard,
  fetchAdminStores,
  patchAdminProduct,
  patchAdminStore,
  postAdminCategory,
  postAdminProduct,
  type MonthlySalesPoint,
} from "@/lib/admin-api";
import type {
  Customer,
  NewProductInput,
  Product,
  ProductUpdateInput,
  Shop,
  ShopMetrics,
  ShopUpdateInput,
} from "@/types/dashboard";

type DashboardContextValue = {
  shops: Shop[];
  activeShop: Shop;
  activeShopId: string;
  products: Product[];
  customers: Customer[];
  metrics: ShopMetrics;
  monthlySales: MonthlySalesPoint[];
  categories: string[];
  isLoadingStores: boolean;
  isLoadingDashboard: boolean;
  loadError: string | null;
  addCategory: (name: string) => Promise<void>;
  removeCategory: (name: string) => Promise<void>;
  switchShop: (shopId: string) => void;
  updateShop: (shopId: string, shop: ShopUpdateInput) => Promise<void>;
  addProduct: (product: NewProductInput) => Promise<void>;
  updateProduct: (productId: string, product: ProductUpdateInput) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  refreshDashboard: () => Promise<void>;
  /** Merchant admin-аас дэлгүүрийн жагсаалтыг дахин татна (жишээ нь platform-оор шинэ дэлгүүр үүсгэсний дараа). */
  reloadShops: () => Promise<void>;
};

const DashboardContext = React.createContext<DashboardContextValue | null>(
  null,
);

export const ACTIVE_SHOP_SESSION_KEY = "shop-builder-active-shop-id";

const PLACEHOLDER_SHOP: Shop = {
  id: "__loading__",
  name: "Ачааллаж байна…",
  slug: "loading",
  ownerId: "",
  logoUrl:
    "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=240&q=80",
  brandColor: "#18181b",
  accentColor: "#f4f4f5",
  currency: "USD",
  radiusPx: 12,
  backgroundColor: "#ffffff",
  tagline: "",
  textColor: "#0f172a",
  createdAt: new Date(0),
  updatedAt: new Date(0),
};

function calculateMetrics(products: Product[]): ShopMetrics {
  const liveProducts = products.filter((product) => product.status === "Live");

  return {
    totalSales: products.reduce((total, product) => total + product.sales, 0),
    orders: Math.round(
      products.reduce((total, product) => total + product.sales, 0) * 0.72,
    ),
    items: liveProducts.length,
    revenue: products.reduce((total, product) => total + product.earning, 0),
  };
}

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [shops, setShops] = React.useState<Shop[]>([]);
  const [activeShopId, setActiveShopId] = React.useState("");
  const [products, setProducts] = React.useState<Product[]>([]);
  const [customers, setCustomers] = React.useState<Customer[]>([]);
  const [categories, setCategories] = React.useState<string[]>([]);
  const [monthlySales, setMonthlySales] = React.useState<MonthlySalesPoint[]>(
    [],
  );
  const [isLoadingStores, setIsLoadingStores] = React.useState(true);
  const [isLoadingDashboard, setIsLoadingDashboard] = React.useState(true);
  const [loadError, setLoadError] = React.useState<string | null>(null);

  const dashboardReq = React.useRef(0);

  const activeShop = React.useMemo(() => {
    const found = shops.find((shop) => shop.id === activeShopId);
    if (found) return found;
    if (shops[0]) return shops[0];
    return PLACEHOLDER_SHOP;
  }, [activeShopId, shops]);

  const effectiveShopId =
    shops.some((s) => s.id === activeShopId) && activeShopId
      ? activeShopId
      : shops[0]?.id ?? "";

  const metrics = React.useMemo(
    () => calculateMetrics(products),
    [products],
  );

  const refreshDashboard = React.useCallback(async () => {
    setIsLoadingDashboard(true);
    if (!effectiveShopId) {
      setProducts([]);
      setCustomers([]);
      setCategories([]);
      setMonthlySales([]);
      setIsLoadingDashboard(false);
      return;
    }
    const n = ++dashboardReq.current;
    setLoadError(null);
    try {
      const d = await fetchAdminDashboard(effectiveShopId);
      if (n !== dashboardReq.current) return;
      setShops((prev) =>
        prev.map((s) => (s.id === d.store.id ? d.store : s)),
      );
      themePersistenceShopIdRef.current = d.store.id;
      if (d.store.themeConfig != null) {
        useThemeStore.getState().applyPersistedSiteTheme(d.store.themeConfig);
      }
      setProducts(d.products);
      setCustomers(d.customers);
      setCategories(d.categories);
      setMonthlySales(d.monthlySales);
    } catch (e) {
      if (n !== dashboardReq.current) return;
      const msg = e instanceof Error ? e.message : String(e);
      setLoadError(msg);
      setProducts([]);
      setCustomers([]);
      setCategories([]);
      setMonthlySales([]);
    } finally {
      if (n === dashboardReq.current) setIsLoadingDashboard(false);
    }
  }, [effectiveShopId]);

  const reloadShops = React.useCallback(async () => {
    setLoadError(null);
    try {
      const list = await fetchAdminStores();
      setShops(list);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setLoadError(msg);
    }
  }, []);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      setIsLoadingStores(true);
      setLoadError(null);
      try {
        const list = await fetchAdminStores();
        if (cancelled) return;
        setShops(list);
      } catch (e) {
        if (cancelled) return;
        const msg = e instanceof Error ? e.message : String(e);
        setLoadError(msg);
        setShops([]);
      } finally {
        if (!cancelled) setIsLoadingStores(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  React.useEffect(() => {
    if (shops.length === 0) {
      setActiveShopId("");
      return;
    }
    let fromSession: string | null = null;
    try {
      fromSession = sessionStorage.getItem(ACTIVE_SHOP_SESSION_KEY);
    } catch {
      /* ignore */
    }
    const next =
      fromSession && shops.some((s) => s.id === fromSession)
        ? fromSession
        : shops[0].id;
    setActiveShopId((cur) =>
      cur && shops.some((s) => s.id === cur) ? cur : next,
    );
  }, [shops]);

  React.useLayoutEffect(() => {
    void refreshDashboard();
  }, [refreshDashboard]);

  const switchShop = React.useCallback((shopId: string) => {
    setActiveShopId(shopId);
    try {
      sessionStorage.setItem(ACTIVE_SHOP_SESSION_KEY, shopId);
    } catch {
      /* ignore */
    }
  }, []);

  const updateShop = React.useCallback(
    async (shopId: string, shop: ShopUpdateInput) => {
      await patchAdminStore(shopId, {
        ...(shop.name !== undefined ? { name: shop.name } : {}),
        ...(shop.slug !== undefined ? { slug: shop.slug } : {}),
        ...(shop.logoUrl !== undefined ? { logoUrl: shop.logoUrl } : {}),
        ...(shop.brandColor !== undefined ? { brandColor: shop.brandColor } : {}),
        ...(shop.accentColor !== undefined
          ? { accentColor: shop.accentColor }
          : {}),
      });
      const list = await fetchAdminStores();
      setShops(list);
      await refreshDashboard();
    },
    [refreshDashboard],
  );

  const addCategory = React.useCallback(
    async (name: string) => {
      const n = name.trim();
      if (!n || !effectiveShopId) return;
      const next = await postAdminCategory(effectiveShopId, n);
      setCategories(next);
    },
    [effectiveShopId],
  );

  const removeCategory = React.useCallback(
    async (name: string) => {
      const n = name.trim();
      if (!n || !effectiveShopId) return;
      const next = await deleteAdminCategory(effectiveShopId, n);
      setCategories(next);
    },
    [effectiveShopId],
  );

  const addProduct = React.useCallback(
    async (product: NewProductInput) => {
      if (!effectiveShopId) return;
      const category = product.category.trim() || "Uncategorized";
      await postAdminProduct(effectiveShopId, {
        name: product.name.trim(),
        sku: product.sku.trim(),
        category,
        size: product.size.trim(),
        description: product.description.trim(),
        imageUrl: product.imageUrl.trim(),
        status: product.status,
        price: product.price,
        inventory: product.inventory,
      });
      await refreshDashboard();
    },
    [effectiveShopId, refreshDashboard],
  );

  const updateProduct = React.useCallback(
    async (productId: string, product: ProductUpdateInput) => {
      if (!effectiveShopId) return;
      await patchAdminProduct(effectiveShopId, productId, {
        ...(product.name !== undefined ? { name: product.name } : {}),
        ...(product.sku !== undefined ? { sku: product.sku } : {}),
        ...(product.category !== undefined ? { category: product.category } : {}),
        ...(product.size !== undefined ? { size: product.size } : {}),
        ...(product.description !== undefined
          ? { description: product.description }
          : {}),
        ...(product.imageUrl !== undefined ? { imageUrl: product.imageUrl } : {}),
        ...(product.status !== undefined ? { status: product.status } : {}),
        ...(product.price !== undefined ? { price: product.price } : {}),
        ...(product.inventory !== undefined
          ? { inventory: product.inventory }
          : {}),
      });
      await refreshDashboard();
    },
    [effectiveShopId, refreshDashboard],
  );

  const deleteProduct = React.useCallback(
    async (productId: string) => {
      if (!effectiveShopId) return;
      await deleteAdminProduct(effectiveShopId, productId);
      await refreshDashboard();
    },
    [effectiveShopId, refreshDashboard],
  );

  const value = React.useMemo<DashboardContextValue>(
    () => ({
      shops,
      activeShop,
      activeShopId: effectiveShopId || activeShop.id,
      products,
      customers,
      metrics,
      monthlySales,
      categories,
      isLoadingStores,
      isLoadingDashboard,
      loadError,
      addCategory,
      removeCategory,
      switchShop,
      updateShop,
      addProduct,
      updateProduct,
      deleteProduct,
      refreshDashboard,
      reloadShops,
    }),
    [
      shops,
      activeShop,
      activeShopId,
      effectiveShopId,
      products,
      customers,
      metrics,
      monthlySales,
      categories,
      isLoadingStores,
      isLoadingDashboard,
      loadError,
      addCategory,
      removeCategory,
      switchShop,
      updateShop,
      addProduct,
      updateProduct,
      deleteProduct,
      refreshDashboard,
      reloadShops,
    ],
  );

  return (
    <DashboardContext.Provider value={value}>
      <ThemeStoreShopPersistenceSync />
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = React.useContext(DashboardContext);

  if (!context) {
    throw new Error("useDashboard must be used within DashboardProvider");
  }

  return context;
}
