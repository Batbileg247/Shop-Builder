import type {
  Customer,
  NewProductInput,
  Product,
  Shop,
  ShopUpdateInput,
  ProductUpdateInput,
} from "@/types/dashboard";
import { shopBuilderFetch } from "@/lib/api/shop-builder-http";

/** --- Response parsing (backend should send ISO date strings + camelCase) --- */

function parseShop(raw: unknown): Shop {
  const o = raw as Record<string, unknown>;
  const id = String(o.id);
  return {
    id,
    name: String(o.name),
    ownerId: String(o.ownerId),
    logoUrl: String(o.logoUrl),
    brandColor: String(o.brandColor),
    accentColor: String(o.accentColor),
    currency: (o.currency as Shop["currency"]) ?? "USD",
    radiusPx:
      typeof o.radiusPx === "number" && Number.isFinite(o.radiusPx)
        ? o.radiusPx
        : 8,
    backgroundColor:
      typeof o.backgroundColor === "string" && o.backgroundColor
        ? String(o.backgroundColor)
        : "#f8fafc",
    tagline:
      typeof o.tagline === "string" && o.tagline.trim()
        ? String(o.tagline)
        : "Quality products, thoughtfully curated.",
    textColor:
      typeof o.textColor === "string" && o.textColor
        ? String(o.textColor)
        : "#0f172a",
    createdAt: new Date(String(o.createdAt)),
    updatedAt: new Date(String(o.updatedAt)),
  };
}

function parseProduct(raw: unknown): Product {
  const o = raw as Record<string, unknown>;
  return {
    id: String(o.id),
    shopId: String(o.shopId),
    name: String(o.name),
    sku: String(o.sku),
    category: String(o.category),
    size: String(o.size ?? ""),
    description: String(o.description ?? ""),
    imageUrl: String(o.imageUrl),
    status: o.status as Product["status"],
    price: Number(o.price),
    inventory: Number(o.inventory),
    sales: Number(o.sales ?? 0),
    earning: Number(o.earning ?? 0),
    createdAt: new Date(String(o.createdAt)),
    updatedAt: new Date(String(o.updatedAt)),
  };
}

function parseCustomer(raw: unknown): Customer {
  const o = raw as Record<string, unknown>;
  return {
    id: String(o.id),
    shopId: String(o.shopId),
    name: String(o.name),
    email: String(o.email),
    avatarUrl: String(o.avatarUrl ?? ""),
    totalOrders: Number(o.totalOrders ?? 0),
    lifetimeValue: Number(o.lifetimeValue ?? 0),
    createdAt: new Date(String(o.createdAt)),
    updatedAt: new Date(String(o.updatedAt)),
  };
}

/** --- Shops --- */

export async function apiListShops(): Promise<Shop[]> {
  const data = await shopBuilderFetch<unknown[]>("/v1/shops", { method: "GET" });
  if (!Array.isArray(data)) return [];
  return data.map(parseShop);
}

export async function apiPatchShop(
  shopId: string,
  body: ShopUpdateInput,
): Promise<Shop> {
  const raw = await shopBuilderFetch<unknown>(`/v1/shops/${encodeURIComponent(shopId)}`, {
    method: "PATCH",
    json: body,
  });
  return parseShop(raw);
}

/** --- Products --- */

export async function apiListProducts(shopId: string): Promise<Product[]> {
  const data = await shopBuilderFetch<unknown[]>(
    `/v1/shops/${encodeURIComponent(shopId)}/products`,
    { method: "GET" },
  );
  if (!Array.isArray(data)) return [];
  return data.map(parseProduct);
}

export async function apiCreateProduct(
  shopId: string,
  body: NewProductInput,
): Promise<Product> {
  const raw = await shopBuilderFetch<unknown>(
    `/v1/shops/${encodeURIComponent(shopId)}/products`,
    { method: "POST", json: body },
  );
  return parseProduct(raw);
}

export async function apiPatchProduct(
  shopId: string,
  productId: string,
  body: ProductUpdateInput,
): Promise<Product> {
  const raw = await shopBuilderFetch<unknown>(
    `/v1/shops/${encodeURIComponent(shopId)}/products/${encodeURIComponent(productId)}`,
    { method: "PATCH", json: body },
  );
  return parseProduct(raw);
}

export async function apiDeleteProduct(
  shopId: string,
  productId: string,
): Promise<void> {
  await shopBuilderFetch(
    `/v1/shops/${encodeURIComponent(shopId)}/products/${encodeURIComponent(productId)}`,
    { method: "DELETE" },
  );
}

/** --- Customers (read-only in UI today) --- */

export async function apiListCustomers(shopId: string): Promise<Customer[]> {
  const data = await shopBuilderFetch<unknown[]>(
    `/v1/shops/${encodeURIComponent(shopId)}/customers`,
    { method: "GET" },
  );
  if (!Array.isArray(data)) return [];
  return data.map(parseCustomer);
}

/** --- Shop category labels (filters / pickers) --- */

export async function apiListShopCategories(shopId: string): Promise<string[]> {
  const data = await shopBuilderFetch<unknown>(
    `/v1/shops/${encodeURIComponent(shopId)}/categories`,
    { method: "GET" },
  );
  if (Array.isArray(data)) return data.map((x) => String(x));
  if (data && typeof data === "object" && Array.isArray((data as { names?: unknown }).names)) {
    return ((data as { names: unknown[] }).names).map((x) => String(x));
  }
  return [];
}

export async function apiAddShopCategory(
  shopId: string,
  name: string,
): Promise<string[]> {
  const data = await shopBuilderFetch<unknown>(
    `/v1/shops/${encodeURIComponent(shopId)}/categories`,
    { method: "POST", json: { name } },
  );
  if (Array.isArray(data)) return data.map((x) => String(x));
  return apiListShopCategories(shopId);
}

export async function apiRemoveShopCategory(
  shopId: string,
  name: string,
): Promise<string[]> {
  const data = await shopBuilderFetch<unknown>(
    `/v1/shops/${encodeURIComponent(shopId)}/categories/${encodeURIComponent(name)}`,
    { method: "DELETE" },
  );
  if (Array.isArray(data)) return data.map((x) => String(x));
  return apiListShopCategories(shopId);
}

/**
 * Loads everything the dashboard needs (parallel per shop).
 * Replace with GET /v1/dashboard/bootstrap on the server when you want one round-trip.
 */
export async function apiLoadFullDashboard(): Promise<{
  shops: Shop[];
  allProducts: Product[];
  allCustomers: Customer[];
  shopCategories: Record<string, string[]>;
}> {
  const shops = await apiListShops();
  const shopIds = shops.map((s) => s.id);
  const nested = await Promise.all(
    shopIds.map(async (id) => {
      const [products, customers, categories] = await Promise.all([
        apiListProducts(id),
        apiListCustomers(id),
        apiListShopCategories(id),
      ]);
      return { id, products, customers, categories };
    }),
  );
  const allProducts: Product[] = [];
  const allCustomers: Customer[] = [];
  const shopCategories: Record<string, string[]> = {};
  for (const row of nested) {
    allProducts.push(...row.products);
    allCustomers.push(...row.customers);
    shopCategories[row.id] = row.categories;
  }
  return { shops, allProducts, allCustomers, shopCategories };
}
