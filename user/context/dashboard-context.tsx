"use client";

import * as React from "react";
import type {
  Customer,
  NewProductInput,
  Product,
  ProductUpdateInput,
  Shop,
} from "../types/index";

export type DashboardState = {
  shops: Shop[];
  activeShop: Shop;
  products: Product[];
  customers: Customer[];
  switchShop: (id: string) => void;
  addProduct: (data: NewProductInput) => void;
  updateProduct: (id: string, data: ProductUpdateInput) => void;
  deleteProduct: (id: string) => void;
};

const DashboardContext = React.createContext<DashboardState | null>(null);

const initialShops: Shop[] = [
  {
    id: "shop_vintage",
    name: "Vintage Store",
    slug: "vintage-store",
    brandColor: "#7C3AED",
    heroImage:
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "shop_tech",
    name: "Tech Hub",
    slug: "tech-hub",
    brandColor: "#0F766E",
    heroImage:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
  },
];

const initialProducts: Product[] = [
  {
    id: "prod_vintage_1",
    shopId: "shop_vintage",
    name: "Leather Trench Coat",
    price: 168,
    stock: 12,
    image:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=640&q=80",
    status: "Active",
  },
  {
    id: "prod_vintage_2",
    shopId: "shop_vintage",
    name: "Retro Sunglasses",
    price: 46,
    stock: 34,
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=640&q=80",
    status: "Draft",
  },
  {
    id: "prod_tech_1",
    shopId: "shop_tech",
    name: "Wireless Noise Headphones",
    price: 229,
    stock: 18,
    image:
      "https://images.unsplash.com/photo-1516728778615-2d590ea1856f?auto=format&fit=crop&w=640&q=80",
    status: "Active",
  },
  {
    id: "prod_tech_2",
    shopId: "shop_tech",
    name: "Smart Home Hub",
    price: 149,
    stock: 24,
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=640&q=80",
    status: "Draft",
  },
];

const initialCustomers: Customer[] = [
  {
    id: "cust_1",
    name: "Avery Cole",
    email: "avery.cole@example.com",
    totalOrders: 14,
  },
  {
    id: "cust_2",
    name: "Jordan Lee",
    email: "jordan.lee@example.com",
    totalOrders: 9,
  },
  {
    id: "cust_3",
    name: "Riley Brooks",
    email: "riley.brooks@example.com",
    totalOrders: 5,
  },
];

function makeId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [shops] = React.useState<Shop[]>(initialShops);
  const [activeShopId, setActiveShopId] = React.useState<string>(
    initialShops[0].id,
  );
  const [products, setProducts] = React.useState<Product[]>(initialProducts);
  const [customers] = React.useState<Customer[]>(initialCustomers);

  const activeShop = React.useMemo(
    () => shops.find((shop) => shop.id === activeShopId) ?? shops[0],
    [activeShopId, shops],
  );

  const shopProducts = React.useMemo(
    () => products.filter((product) => product.shopId === activeShop.id),
    [products, activeShop.id],
  );

  const switchShop = React.useCallback((id: string) => {
    setActiveShopId(id);
  }, []);

  const addProduct = React.useCallback(
    (data: NewProductInput) => {
      const nextProduct: Product = {
        id: makeId("prod"),
        shopId: activeShop.id,
        ...data,
      };
      setProducts((current) => [nextProduct, ...current]);
    },
    [activeShop.id],
  );

  const updateProduct = React.useCallback(
    (id: string, data: ProductUpdateInput) => {
      setProducts((current) =>
        current.map((product) =>
          product.id === id ? { ...product, ...data } : product,
        ),
      );
    },
    [],
  );

  const deleteProduct = React.useCallback((id: string) => {
    setProducts((current) => current.filter((product) => product.id !== id));
  }, []);

  const value = React.useMemo<DashboardState>(
    () => ({
      shops,
      activeShop,
      products: shopProducts,
      customers,
      switchShop,
      addProduct,
      updateProduct,
      deleteProduct,
    }),
    [
      shops,
      activeShop,
      shopProducts,
      customers,
      switchShop,
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

export function useDashboard(): DashboardState {
  const context = React.useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within DashboardProvider");
  }
  return context;
}
