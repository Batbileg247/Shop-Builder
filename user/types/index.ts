export type ProductStatus = "Active" | "Draft";

export interface Shop {
  id: string;
  name: string;
  slug: string;
  brandColor: string;
  heroImage: string;
}

export interface Product {
  id: string;
  shopId: string;
  name: string;
  price: number;
  stock: number;
  image: string;
  status: ProductStatus;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  totalOrders: number;
}

export interface NewProductInput {
  name: string;
  price: number;
  stock: number;
  image: string;
  status: ProductStatus;
}

export interface ProductUpdateInput {
  name?: string;
  price?: number;
  stock?: number;
  image?: string;
  status?: ProductStatus;
}
