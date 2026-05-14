import type { Customer, Product, Shop } from "@/types/dashboard";
import { getMerchantBaseUrl } from "@/lib/storefront-api";

export type MonthlySalesPoint = {
  shopId: string;
  month: string;
  sales: number;
};

function merchantBase(): string {
  const b = getMerchantBaseUrl();
  if (!b) {
    throw new Error("NEXT_PUBLIC_MERCHANT_API_URL тохируулаагүй байна.");
  }
  return b.replace(/\/$/, "");
}

async function readJson<T>(res: Response): Promise<T> {
  const data = (await res.json().catch(() => null)) as T | { error?: string };
  if (!res.ok) {
    const err =
      data && typeof data === "object" && "error" in data && typeof (data as { error: unknown }).error === "string"
        ? (data as { error: string }).error
        : `HTTP ${res.status}`;
    throw new Error(err);
  }
  return data as T;
}

function parseShop(raw: Record<string, unknown>): Shop {
  const cur = raw.currency;
  const currency =
    cur === "USD" || cur === "EUR" || cur === "MNT" ? cur : "USD";
  return {
    id: String(raw.id),
    name: String(raw.name),
    slug: String(raw.slug),
    ownerId: String(raw.ownerId),
    logoUrl: String(raw.logoUrl ?? ""),
    brandColor: String(raw.brandColor ?? "#18181b"),
    accentColor: String(raw.accentColor ?? "#fafafa"),
    currency,
    createdAt: new Date(String(raw.createdAt ?? "")),
    updatedAt: new Date(String(raw.updatedAt ?? "")),
  };
}

function parseProduct(raw: Record<string, unknown>): Product {
  const st = raw.status === "Draft" || raw.status === "Live" ? raw.status : "Live";
  return {
    id: String(raw.id),
    shopId: String(raw.shopId),
    name: String(raw.name),
    sku: String(raw.sku ?? ""),
    category: String(raw.category ?? ""),
    size: String(raw.size ?? ""),
    description: String(raw.description ?? ""),
    imageUrl: String(raw.imageUrl ?? ""),
    status: st,
    price: Number(raw.price ?? 0),
    inventory: Number(raw.inventory ?? 0),
    sales: Number(raw.sales ?? 0),
    earning: Number(raw.earning ?? 0),
    createdAt: new Date(String(raw.createdAt ?? "")),
    updatedAt: new Date(String(raw.updatedAt ?? "")),
  };
}

function parseCustomer(raw: Record<string, unknown>): Customer {
  return {
    id: String(raw.id),
    shopId: String(raw.shopId),
    name: String(raw.name),
    email: String(raw.email),
    avatarUrl: String(raw.avatarUrl ?? ""),
    totalOrders: Number(raw.totalOrders ?? 0),
    lifetimeValue: Number(raw.lifetimeValue ?? 0),
    createdAt: new Date(String(raw.createdAt ?? "")),
    updatedAt: new Date(String(raw.updatedAt ?? "")),
  };
}

export async function fetchAdminStores(opts?: {
  signal?: AbortSignal;
}): Promise<Shop[]> {
  const res = await fetch(`${merchantBase()}/admin/stores`, {
    method: "GET",
    cache: "no-store",
    headers: { Accept: "application/json" },
    signal: opts?.signal,
  });
  const rows = await readJson<unknown[]>(res);
  if (!Array.isArray(rows)) throw new Error("stores: JSON array expected");
  return rows.map((r) => parseShop(r as Record<string, unknown>));
}

export type AdminDashboardPayload = {
  store: Shop;
  products: Product[];
  categories: string[];
  customers: Customer[];
  monthlySales: MonthlySalesPoint[];
};

export async function fetchAdminDashboard(
  storeId: string,
  opts?: { signal?: AbortSignal },
): Promise<AdminDashboardPayload> {
  const res = await fetch(
    `${merchantBase()}/admin/stores/${encodeURIComponent(storeId)}/dashboard`,
    {
      method: "GET",
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal: opts?.signal,
    },
  );
  const raw = await readJson<Record<string, unknown>>(res);
  const store = parseShop(raw.store as Record<string, unknown>);
  const products = Array.isArray(raw.products)
    ? (raw.products as unknown[]).map((p) =>
        parseProduct(p as Record<string, unknown>),
      )
    : [];
  const categories = Array.isArray(raw.categories)
    ? (raw.categories as unknown[]).map((c) => String(c))
    : [];
  const customers = Array.isArray(raw.customers)
    ? (raw.customers as unknown[]).map((c) =>
        parseCustomer(c as Record<string, unknown>),
      )
    : [];
  const monthlySales = Array.isArray(raw.monthlySales)
    ? (raw.monthlySales as unknown[]).map((m) => {
        const o = m as Record<string, unknown>;
        return {
          shopId: String(o.shopId),
          month: String(o.month),
          sales: Number(o.sales ?? 0),
        };
      })
    : [];
  return { store, products, categories, customers, monthlySales };
}

export async function patchAdminStore(
  storeId: string,
  body: Partial<{
    name: string;
    slug: string;
    logoUrl: string;
    brandColor: string;
    accentColor: string;
    currency: Shop["currency"];
  }>,
  opts?: { signal?: AbortSignal },
): Promise<Shop> {
  const res = await fetch(
    `${merchantBase()}/admin/stores/${encodeURIComponent(storeId)}`,
    {
      method: "PATCH",
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: opts?.signal,
    },
  );
  const raw = await readJson<Record<string, unknown>>(res);
  return parseShop(raw);
}

export async function postAdminCategory(
  storeId: string,
  name: string,
  opts?: { signal?: AbortSignal },
): Promise<string[]> {
  const res = await fetch(
    `${merchantBase()}/admin/stores/${encodeURIComponent(storeId)}/categories`,
    {
      method: "POST",
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
      signal: opts?.signal,
    },
  );
  const raw = await readJson<{ categories?: unknown }>(res);
  return Array.isArray(raw.categories)
    ? (raw.categories as unknown[]).map((c) => String(c))
    : [];
}

export async function deleteAdminCategory(
  storeId: string,
  name: string,
  opts?: { signal?: AbortSignal },
): Promise<string[]> {
  const q = new URLSearchParams({ name });
  const res = await fetch(
    `${merchantBase()}/admin/stores/${encodeURIComponent(storeId)}/categories?${q}`,
    {
      method: "DELETE",
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal: opts?.signal,
    },
  );
  const raw = await readJson<{ categories?: unknown }>(res);
  return Array.isArray(raw.categories)
    ? (raw.categories as unknown[]).map((c) => String(c))
    : [];
}

export async function postAdminProduct(
  storeId: string,
  body: Record<string, unknown>,
  opts?: { signal?: AbortSignal },
): Promise<Product> {
  const res = await fetch(
    `${merchantBase()}/admin/stores/${encodeURIComponent(storeId)}/products`,
    {
      method: "POST",
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: opts?.signal,
    },
  );
  const raw = await readJson<Record<string, unknown>>(res);
  return parseProduct(raw);
}

export async function patchAdminProduct(
  storeId: string,
  productId: string,
  body: Record<string, unknown>,
  opts?: { signal?: AbortSignal },
): Promise<Product> {
  const res = await fetch(
    `${merchantBase()}/admin/stores/${encodeURIComponent(storeId)}/products/${encodeURIComponent(productId)}`,
    {
      method: "PATCH",
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: opts?.signal,
    },
  );
  const raw = await readJson<Record<string, unknown>>(res);
  return parseProduct(raw);
}

export async function deleteAdminProduct(
  storeId: string,
  productId: string,
  opts?: { signal?: AbortSignal },
): Promise<void> {
  const res = await fetch(
    `${merchantBase()}/admin/stores/${encodeURIComponent(storeId)}/products/${encodeURIComponent(productId)}`,
    {
      method: "DELETE",
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal: opts?.signal,
    },
  );
  await readJson<unknown>(res);
}
