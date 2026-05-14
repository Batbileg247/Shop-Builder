"use client";

import * as React from "react";
import type {
  Customer,
  NewProductInput,
  Product,
  ProductUpdateInput,
  Shop,
  ShopMetrics,
  ShopUpdateInput,
} from "@/types/dashboard";
import { shopsData } from "@/lib/mockData";

type DashboardContextValue = {
  shops: Shop[];
  activeShop: Shop;
  activeShopId: string;
  products: Product[];
  customers: Customer[];
  metrics: ShopMetrics;
  /** Owner-defined category names for the active shop (filters / pickers). */
  categories: string[];
  addCategory: (name: string) => void;
  removeCategory: (name: string) => void;
  switchShop: (shopId: string) => void;
  updateShop: (shopId: string, shop: ShopUpdateInput) => void;
  addProduct: (product: NewProductInput) => void;
  updateProduct: (productId: string, product: ProductUpdateInput) => void;
  deleteProduct: (productId: string) => void;
};

const DashboardContext = React.createContext<DashboardContextValue | null>(
  null,
);

const now = new Date("2026-05-13T00:00:00.000Z");

const shopsSeed: Shop[] = shopsData;

const productsSeed: Product[] = [];

const customersSeed: Customer[] = [
  {
    id: "cust_luma_01",
    shopId: "shop_luma",
    name: "Avery Cole",
    email: "avery.cole@example.com",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80",
    totalOrders: 18,
    lifetimeValue: 3420,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "cust_nova_01",
    shopId: "shop_nova",
    name: "Mika Tan",
    email: "mika.tan@example.com",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80",
    totalOrders: 11,
    lifetimeValue: 2810,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "cust_terra_01",
    shopId: "shop_terra",
    name: "Noah Stone",
    email: "noah.stone@example.com",
    avatarUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=240&q=80",
    totalOrders: 9,
    lifetimeValue: 1368,
    createdAt: now,
    updatedAt: now,
  },
];

function createId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

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
  const [shops, setShops] = React.useState<Shop[]>(shopsSeed);
  const [activeShopId, setActiveShopId] = React.useState(shopsSeed[0].id);
  const [allProducts, setAllProducts] = React.useState<Product[]>(productsSeed);
  const [allCustomers] = React.useState<Customer[]>(customersSeed);
  const [shopCategories, setShopCategories] = React.useState<
    Record<string, string[]>
  >({});

  const activeShop = React.useMemo(
    () => shops.find((shop) => shop.id === activeShopId) ?? shops[0],
    [activeShopId, shops],
  );

  const products = React.useMemo(
    () => allProducts.filter((product) => product.shopId === activeShop.id),
    [activeShop.id, allProducts],
  );

  const customers = React.useMemo(
    () => allCustomers.filter((customer) => customer.shopId === activeShop.id),
    [activeShop.id, allCustomers],
  );

  const metrics = React.useMemo(() => calculateMetrics(products), [products]);

  const categories = React.useMemo(
    () => shopCategories[activeShop.id] ?? [],
    [activeShop.id, shopCategories],
  );

  const addCategory = React.useCallback(
    (name: string) => {
      const n = name.trim();
      if (!n) return;
      setShopCategories((prev) => {
        const cur = prev[activeShop.id] ?? [];
        if (cur.includes(n)) return prev;
        return {
          ...prev,
          [activeShop.id]: [...cur, n].sort((a, b) => a.localeCompare(b)),
        };
      });
    },
    [activeShop.id],
  );

  const removeCategory = React.useCallback(
    (name: string) => {
      const n = name.trim();
      if (!n) return;
      setShopCategories((prev) => {
        const cur = prev[activeShop.id] ?? [];
        return { ...prev, [activeShop.id]: cur.filter((c) => c !== n) };
      });
    },
    [activeShop.id],
  );

  const switchShop = React.useCallback((shopId: string) => {
    setActiveShopId(shopId);
  }, []);

  const updateShop = React.useCallback(
    (shopId: string, shop: ShopUpdateInput) => {
      setShops((currentShops) =>
        currentShops.map((currentShop) =>
          currentShop.id === shopId
            ? { ...currentShop, ...shop, updatedAt: new Date() }
            : currentShop,
        ),
      );
    },
    [],
  );

  const addProduct = React.useCallback(
    (product: NewProductInput) => {
      const createdAt = new Date();
      const category = product.category.trim() || "Uncategorized";
      const sku =
        product.sku.trim() ||
        `SKU-${activeShop.slug.slice(0, 4).toUpperCase()}-${Date.now().toString().slice(-6)}`;
      const nextProduct: Product = {
        id: createId("prod"),
        shopId: activeShop.id,
        name: product.name.trim(),
        sku,
        category,
        size: product.size.trim(),
        description: product.description.trim(),
        imageUrl: product.imageUrl.trim(),
        status: product.status,
        price: product.price,
        inventory: product.inventory,
        sales: 0,
        earning: 0,
        createdAt,
        updatedAt: createdAt,
      };

      if (category) {
        setShopCategories((prev) => {
          const cur = prev[activeShop.id] ?? [];
          if (cur.includes(category)) return prev;
          return {
            ...prev,
            [activeShop.id]: [...cur, category].sort((a, b) =>
              a.localeCompare(b),
            ),
          };
        });
      }

      setAllProducts((currentProducts) => [nextProduct, ...currentProducts]);
    },
    [activeShop.id, activeShop.slug],
  );

  const updateProduct = React.useCallback(
    (productId: string, product: ProductUpdateInput) => {
      setAllProducts((currentProducts) =>
        currentProducts.map((currentProduct) =>
          currentProduct.id === productId
            ? { ...currentProduct, ...product, updatedAt: new Date() }
            : currentProduct,
        ),
      );
    },
    [],
  );

  const deleteProduct = React.useCallback((productId: string) => {
    setAllProducts((currentProducts) =>
      currentProducts.filter((product) => product.id !== productId),
    );
  }, []);

  const value = React.useMemo<DashboardContextValue>(
    () => ({
      shops,
      activeShop,
      activeShopId,
      products,
      customers,
      metrics,
      categories,
      addCategory,
      removeCategory,
      switchShop,
      updateShop,
      addProduct,
      updateProduct,
      deleteProduct,
    }),
    [
      shops,
      activeShop,
      activeShopId,
      products,
      customers,
      metrics,
      categories,
      addCategory,
      removeCategory,
      switchShop,
      updateShop,
      addProduct,
      updateProduct,
      deleteProduct,
    ],
  );

  return (
    <DashboardContext.Provider value={value}>
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
