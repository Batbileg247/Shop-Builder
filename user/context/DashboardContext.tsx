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

type DashboardContextValue = {
  shops: Shop[];
  activeShop: Shop;
  activeShopId: string;
  products: Product[];
  customers: Customer[];
  metrics: ShopMetrics;
  switchShop: (shopId: string) => void;
  updateShop: (shopId: string, shop: ShopUpdateInput) => void;
  addProduct: (product: NewProductInput) => void;
  updateProduct: (productId: string, product: ProductUpdateInput) => void;
  deleteProduct: (productId: string) => void;
};

const DashboardContext = React.createContext<DashboardContextValue | null>(null);

const now = new Date("2026-05-13T00:00:00.000Z");

const shopsSeed: Shop[] = [
  {
    id: "shop_luma",
    name: "Luma Atelier",
    slug: "luma-atelier",
    ownerId: "user_01",
    logoUrl:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=240&q=80",
    brandColor: "#8b5cf6",
    accentColor: "#f0e7ff",
    currency: "USD",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "shop_nova",
    name: "Nova Tech Supply",
    slug: "nova-tech-supply",
    ownerId: "user_01",
    logoUrl:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=240&q=80",
    brandColor: "#3b82f6",
    accentColor: "#dbeafe",
    currency: "USD",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "shop_terra",
    name: "Terra Home Goods",
    slug: "terra-home-goods",
    ownerId: "user_01",
    logoUrl:
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=240&q=80",
    brandColor: "#f97316",
    accentColor: "#ffedd5",
    currency: "USD",
    createdAt: now,
    updatedAt: now,
  },
];

const productsSeed: Product[] = [
  {
    id: "prod_luma_01",
    shopId: "shop_luma",
    name: "Oversized Wool Blazer",
    sku: "LUM-OWB-001",
    description: "Structured wool blazer with soft lining.",
    imageUrl:
      "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?auto=format&fit=crop&w=640&q=80",
    status: "Live",
    price: 168,
    inventory: 42,
    sales: 274,
    earning: 46032,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod_luma_02",
    shopId: "shop_luma",
    name: "Silk Ribbon Flats",
    sku: "LUM-SRF-014",
    description: "Low profile flats with satin ribbon detail.",
    imageUrl:
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=640&q=80",
    status: "Live",
    price: 92,
    inventory: 68,
    sales: 198,
    earning: 18216,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod_luma_03",
    shopId: "shop_luma",
    name: "Pearl Handle Mini Bag",
    sku: "LUM-PMB-021",
    description: "Compact evening bag with pearl handle.",
    imageUrl:
      "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=640&q=80",
    status: "Draft",
    price: 124,
    inventory: 20,
    sales: 0,
    earning: 0,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod_nova_01",
    shopId: "shop_nova",
    name: "Studio Wireless Headphones",
    sku: "NOV-SWH-009",
    description: "Bluetooth headphones with active noise cancellation.",
    imageUrl:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=640&q=80",
    status: "Live",
    price: 229,
    inventory: 36,
    sales: 331,
    earning: 75799,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod_nova_02",
    shopId: "shop_nova",
    name: "Compact Desk Dock",
    sku: "NOV-CDD-018",
    description: "Multi-port desk dock for compact workspaces.",
    imageUrl:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=640&q=80",
    status: "Draft",
    price: 149,
    inventory: 18,
    sales: 47,
    earning: 7003,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod_terra_01",
    shopId: "shop_terra",
    name: "Ceramic Pour-Over Set",
    sku: "TER-CPO-004",
    description: "Glazed ceramic dripper with matching server.",
    imageUrl:
      "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=640&q=80",
    status: "Live",
    price: 78,
    inventory: 57,
    sales: 219,
    earning: 17082,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod_terra_02",
    shopId: "shop_terra",
    name: "Linen Storage Basket",
    sku: "TER-LSB-011",
    description: "Soft-sided storage basket with leather handles.",
    imageUrl:
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=640&q=80",
    status: "Live",
    price: 64,
    inventory: 74,
    sales: 156,
    earning: 9984,
    createdAt: now,
    updatedAt: now,
  },
];

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
      const nextProduct: Product = {
        id: createId("prod"),
        shopId: activeShop.id,
        ...product,
        imageUrl:
          product.imageUrl ||
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=640&q=80",
        sales: 0,
        earning: 0,
        createdAt,
        updatedAt: createdAt,
      };

      setAllProducts((currentProducts) => [nextProduct, ...currentProducts]);
    },
    [activeShop.id],
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
