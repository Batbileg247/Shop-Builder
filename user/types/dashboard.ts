export type ProductStatus = "Live" | "Draft";

export interface Shop {
  id: string;
  name: string;
  ownerId: string;
  logoUrl: string;
  brandColor: string;
  accentColor: string;
  currency: "USD" | "EUR" | "MNT";
  /** Card / shell corner radius in pixels. */
  radiusPx: number;
  /** Storefront page background. */
  backgroundColor: string;
  /** Hero tagline under the shop name. */
  tagline: string;
  /** Default body text color on storefront surfaces. */
  textColor: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  shopId: string;
  name: string;
  sku: string;
  category: string;
  size: string;
  description: string;
  imageUrl: string;
  status: ProductStatus;
  price: number;
  inventory: number;
  sales: number;
  earning: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer {
  id: string;
  shopId: string;
  name: string;
  email: string;
  avatarUrl: string;
  totalOrders: number;
  lifetimeValue: number;
  createdAt: Date;
  updatedAt: Date;
}

export type NewProductInput = Pick<
  Product,
  | "name"
  | "sku"
  | "category"
  | "size"
  | "description"
  | "imageUrl"
  | "status"
  | "price"
  | "inventory"
>;

export type ProductUpdateInput = Partial<NewProductInput>;

export type ShopUpdateInput = Partial<
  Pick<
    Shop,
    | "name"
    | "logoUrl"
    | "brandColor"
    | "accentColor"
    | "radiusPx"
    | "backgroundColor"
    | "tagline"
    | "textColor"
  >
>;

export interface ShopMetrics {
  totalSales: number;
  orders: number;
  items: number;
  revenue: number;
}
