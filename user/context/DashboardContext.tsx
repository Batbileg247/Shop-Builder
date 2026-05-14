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
import * as shopApi from "@/lib/api/shop-builder-client";
import { isShopBuilderApiMock } from "@/lib/env";
import { shopsData } from "@/lib/mockData";

export type DashboardDataSource = "mock" | "api";
export type DashboardRemoteStatus = "idle" | "loading" | "ready" | "error";

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
  /** `mock` = bundled seeds; `api` = `NEXT_PUBLIC_SHOP_BUILDER_API_URL`. */
  dataSource: DashboardDataSource;
  remoteStatus: DashboardRemoteStatus;
  remoteError: string | null;
  /** Reload shops, products, customers, categories from the API. */
  refreshFromApi: () => Promise<void>;
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
  const dataSource: DashboardDataSource = isShopBuilderApiMock()
    ? "mock"
    : "api";
  const [shops, setShops] = React.useState<Shop[]>(shopsSeed);
  const [activeShopId, setActiveShopId] = React.useState(readInitialActiveShopId);
  const [allProducts, setAllProducts] = React.useState<Product[]>(productsSeed);
  const [allCustomers, setAllCustomers] =
    React.useState<Customer[]>(customersSeed);
  const [shopCategories, setShopCategories] = React.useState<
    Record<string, string[]>
  >(() => ({ ...shopCategoriesSeed }));
  const [remoteStatus, setRemoteStatus] =
    React.useState<DashboardRemoteStatus>(() =>
      isShopBuilderApiMock() ? "ready" : "loading",
    );
  const [remoteError, setRemoteError] = React.useState<string | null>(null);

  const allProductsRef = React.useRef(allProducts);
  React.useEffect(() => {
    allProductsRef.current = allProducts;
  }, [allProducts]);

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

  const refreshFromApi = React.useCallback(async () => {
    if (isShopBuilderApiMock()) return;
    setRemoteStatus("loading");
    setRemoteError(null);
    try {
      const bundle = await shopApi.apiLoadFullDashboard();
      setShops(bundle.shops);
      setAllProducts(bundle.allProducts);
      setAllCustomers(bundle.allCustomers);
      setShopCategories(bundle.shopCategories);
      setActiveShopId((prev) => {
        const ids = new Set(bundle.shops.map((s) => s.id));
        if (ids.has(prev)) return prev;
        return bundle.shops[0]?.id ?? prev;
      });
      setRemoteStatus("ready");
    } catch (e) {
      setRemoteError(
        e instanceof Error ? e.message : "Failed to load dashboard",
      );
      setRemoteStatus("error");
    }
  }, []);

  React.useEffect(() => {
    if (isShopBuilderApiMock()) return;
    void refreshFromApi();
  }, [refreshFromApi]);

  const addCategory = React.useCallback(
    (name: string) => {
      const n = name.trim();
      if (!n) return;
      if (isShopBuilderApiMock()) {
        setShopCategories((prev) => {
          const cur = prev[activeShop.id] ?? [];
          if (cur.includes(n)) return prev;
          return {
            ...prev,
            [activeShop.id]: [...cur, n].sort((a, b) => a.localeCompare(b)),
          };
        });
        return;
      }
      void (async () => {
        try {
          const next = await shopApi.apiAddShopCategory(activeShop.id, n);
          setShopCategories((prev) => ({
            ...prev,
            [activeShop.id]: [...next].sort((a, b) => a.localeCompare(b)),
          }));
        } catch (e) {
          setRemoteError(
            e instanceof Error ? e.message : "Failed to add category",
          );
        }
      })();
    },
    [activeShop.id],
  );

  const removeCategory = React.useCallback(
    (name: string) => {
      const n = name.trim();
      if (!n) return;
      if (isShopBuilderApiMock()) {
        setShopCategories((prev) => {
          const cur = prev[activeShop.id] ?? [];
          return { ...prev, [activeShop.id]: cur.filter((c) => c !== n) };
        });
        return;
      }
      void (async () => {
        try {
          const next = await shopApi.apiRemoveShopCategory(activeShop.id, n);
          setShopCategories((prev) => ({
            ...prev,
            [activeShop.id]: [...next].sort((a, b) => a.localeCompare(b)),
          }));
        } catch (e) {
          setRemoteError(
            e instanceof Error ? e.message : "Failed to remove category",
          );
        }
      })();
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
      if (isShopBuilderApiMock()) {
        setShops((currentShops) =>
          currentShops.map((currentShop) =>
            currentShop.id === shopId
              ? { ...currentShop, ...shop, updatedAt: new Date() }
              : currentShop,
          ),
        );
        return;
      }
      void (async () => {
        try {
          const updated = await shopApi.apiPatchShop(shopId, shop);
          setShops((currentShops) =>
            currentShops.map((s) => (s.id === shopId ? updated : s)),
          );
        } catch (e) {
          setRemoteError(
            e instanceof Error ? e.message : "Failed to update shop",
          );
        }
      })();
    },
    [],
  );

  const addProduct = React.useCallback(
    (product: NewProductInput) => {
      const runMock = () => {
        const createdAt = new Date();
        const category = product.category.trim() || "Uncategorized";
      const sku =
        product.sku.trim() ||
        `SKU-${activeShop.id.replace(/[^a-zA-Z0-9]/g, "").slice(0, 4).toUpperCase()}-${Date.now().toString().slice(-6)}`;
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
      };

      if (isShopBuilderApiMock()) {
        runMock();
        return;
      }

      void (async () => {
        try {
          const created = await shopApi.apiCreateProduct(
            activeShop.id,
            product,
          );
          setAllProducts((currentProducts) => [created, ...currentProducts]);
          const category = product.category.trim() || "Uncategorized";
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
        } catch (e) {
          setRemoteError(
            e instanceof Error ? e.message : "Failed to create product",
          );
        }
      })();
    },
    [activeShop.id],
  );

  const updateProduct = React.useCallback(
    (productId: string, product: ProductUpdateInput) => {
      if (isShopBuilderApiMock()) {
        setAllProducts((currentProducts) =>
          currentProducts.map((currentProduct) =>
            currentProduct.id === productId
              ? { ...currentProduct, ...product, updatedAt: new Date() }
              : currentProduct,
          ),
        );
        return;
      }
      void (async () => {
        const row = allProductsRef.current.find((p) => p.id === productId);
        if (!row) return;
        try {
          const updated = await shopApi.apiPatchProduct(
            row.shopId,
            productId,
            product,
          );
          setAllProducts((currentProducts) =>
            currentProducts.map((p) => (p.id === productId ? updated : p)),
          );
        } catch (e) {
          setRemoteError(
            e instanceof Error ? e.message : "Failed to update product",
          );
        }
      })();
    },
    [],
  );

  const deleteProduct = React.useCallback((productId: string) => {
    if (isShopBuilderApiMock()) {
      setAllProducts((currentProducts) =>
        currentProducts.filter((product) => product.id !== productId),
      );
      return;
    }
    void (async () => {
      const row = allProductsRef.current.find((p) => p.id === productId);
      if (!row) return;
      try {
        await shopApi.apiDeleteProduct(row.shopId, productId);
        setAllProducts((currentProducts) =>
          currentProducts.filter((product) => product.id !== productId),
        );
      } catch (e) {
        setRemoteError(
          e instanceof Error ? e.message : "Failed to delete product",
        );
      }
    })();
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
      dataSource,
      remoteStatus,
      remoteError,
      refreshFromApi,
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
      dataSource,
      remoteStatus,
      remoteError,
      refreshFromApi,
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
