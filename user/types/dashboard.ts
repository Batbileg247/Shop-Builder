export type ProductStatus = "Live" | "Draft";

export interface Shop {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  logoUrl: string;
  brandColor: string;
  accentColor: string;
  currency: "USD" | "EUR" | "MNT";
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  shopId: string;
  name: string;
  sku: string;
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
  "name" | "sku" | "description" | "imageUrl" | "status" | "price" | "inventory"
>;

export type ProductUpdateInput = Partial<NewProductInput>;

export type ShopUpdateInput = Partial<
  Pick<Shop, "name" | "slug" | "logoUrl" | "brandColor" | "accentColor">
>;

export interface ShopMetrics {
  totalSales: number;
  orders: number;
  items: number;
  revenue: number;
}
