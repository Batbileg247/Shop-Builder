"use client";

import * as React from "react";
import { ThemeStoreShopPersistenceSync } from "@/context/theme-store-shop-persistence-sync";
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

const productsSeed: Product[] = [
  {
    id: "prod_luma_01",
    shopId: "shop_luma",
    name: "Merino wrap scarf",
    sku: "LUMA-SCF-01",
    category: "Accessories",
    size: "One size",
    description: "Soft merino in a muted palette.",
    imageUrl:
      "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=800&q=80",
    status: "Live",
    price: 128,
    inventory: 24,
    sales: 42,
    earning: 4200,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod_luma_02",
    shopId: "shop_luma",
    name: "Linen chore coat",
    sku: "LUMA-COT-02",
    category: "Apparel",
    size: "M",
    description: "Relaxed fit, garment-dyed linen.",
    imageUrl:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80",
    status: "Live",
    price: 245,
    inventory: 8,
    sales: 18,
    earning: 3780,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod_luma_03",
    shopId: "shop_luma",
    name: "Studio tote",
    sku: "LUMA-TOT-03",
    category: "Accessories",
    size: "One size",
    description: "Heavy canvas, interior zip pocket.",
    imageUrl:
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80",
    status: "Live",
    price: 72,
    inventory: 0,
    sales: 60,
    earning: 3600,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod_luma_04",
    shopId: "shop_luma",
    name: "Silk bandana set",
    sku: "LUMA-BND-04",
    category: "Apparel",
    size: "S",
    description: "Two-pack, hand-rolled edges.",
    imageUrl:
      "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=800&q=80",
    status: "Draft",
    price: 48,
    inventory: 40,
    sales: 0,
    earning: 0,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod_nova_01",
    shopId: "shop_nova",
    name: "USB-C hub 7-in-1",
    sku: "NOVA-HUB-01",
    category: "Electronics",
    size: "—",
    description: "HDMI, SD, USB-A, pass-through charging.",
    imageUrl:
      "https://images.unsplash.com/photo-1625948515291-69613efd103f?auto=format&fit=crop&w=800&q=80",
    status: "Live",
    price: 59,
    inventory: 120,
    sales: 210,
    earning: 10500,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod_nova_02",
    shopId: "shop_nova",
    name: "Mechanical keyboard",
    sku: "NOVA-KBD-02",
    category: "Electronics",
    size: "75%",
    description: "Hot-swap, tactile switches, RGB optional.",
    imageUrl:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
    status: "Live",
    price: 149,
    inventory: 35,
    sales: 88,
    earning: 11440,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod_nova_03",
    shopId: "shop_nova",
    name: "Desk mat XL",
    sku: "NOVA-MAT-03",
    category: "Office",
    size: "900×400mm",
    description: "Low-friction surface, stitched edge.",
    imageUrl:
      "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=800&q=80",
    status: "Live",
    price: 34,
    inventory: 200,
    sales: 150,
    earning: 4500,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod_nova_04",
    shopId: "shop_nova",
    name: "Webcam 1080p",
    sku: "NOVA-CAM-04",
    category: "Electronics",
    size: "—",
    description: "Autofocus, privacy shutter.",
    imageUrl:
      "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=800&q=80",
    status: "Draft",
    price: 79,
    inventory: 15,
    sales: 0,
    earning: 0,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod_terra_01",
    shopId: "shop_terra",
    name: "Ceramic pour-over set",
    sku: "TER-KIT-01",
    category: "Kitchen",
    size: "2-cup",
    description: "Dripper + carafe, matte glaze.",
    imageUrl:
      "https://images.unsplash.com/photo-1517256064520-09c130fc7a5e?auto=format&fit=crop&w=800&q=80",
    status: "Live",
    price: 62,
    inventory: 45,
    sales: 72,
    earning: 4464,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod_terra_02",
    shopId: "shop_terra",
    name: "Linen table runner",
    sku: "TER-RUN-02",
    category: "Decor",
    size: "240cm",
    description: "Pre-washed European linen.",
    imageUrl:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80",
    status: "Live",
    price: 54,
    inventory: 30,
    sales: 40,
    earning: 2160,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod_terra_03",
    shopId: "shop_terra",
    name: "Oak serving board",
    sku: "TER-BRD-03",
    category: "Kitchen",
    size: "45×30cm",
    description: "Mineral oil finish, juice groove.",
    imageUrl:
      "https://images.unsplash.com/photo-1603199506016-b9a594b593c0?auto=format&fit=crop&w=800&q=80",
    status: "Live",
    price: 89,
    inventory: 12,
    sales: 25,
    earning: 2225,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod_terra_04",
    shopId: "shop_terra",
    name: "Wool throw blanket",
    sku: "TER-THR-04",
    category: "Decor",
    size: "130×180cm",
    description: "Heathered lambswool, fringed ends.",
    imageUrl:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
    status: "Live",
    price: 118,
    inventory: 6,
    sales: 14,
    earning: 1652,
    createdAt: now,
    updatedAt: now,
  },
];

const shopCategoriesSeed: Record<string, string[]> = {
  shop_luma: ["Accessories", "Apparel"],
  shop_nova: ["Electronics", "Office"],
  shop_terra: ["Kitchen", "Decor"],
};

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

const ACTIVE_SHOP_SESSION_KEY = "shop-builder-active-shop-id";

function readInitialActiveShopId() {
  if (typeof window === "undefined") return shopsSeed[0].id;
  try {
    const v = sessionStorage.getItem(ACTIVE_SHOP_SESSION_KEY);
    if (v && shopsSeed.some((s) => s.id === v)) return v;
  } catch {
    /* ignore */
  }
  return shopsSeed[0].id;
}

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [shops, setShops] = React.useState<Shop[]>(shopsSeed);
  const [activeShopId, setActiveShopId] = React.useState(readInitialActiveShopId);
  const [allProducts, setAllProducts] = React.useState<Product[]>(productsSeed);
  const [allCustomers] = React.useState<Customer[]>(customersSeed);
  const [shopCategories, setShopCategories] = React.useState<
    Record<string, string[]>
  >(() => ({ ...shopCategoriesSeed }));

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
    try {
      sessionStorage.setItem(ACTIVE_SHOP_SESSION_KEY, shopId);
    } catch {
      /* ignore */
    }
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
