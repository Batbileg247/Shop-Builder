export type Surface = "builder" | "admin" | "client";
export type ProductLayout = "grid" | "editorial";
export type OrderStatus = "pending" | "fulfilled" | "cancelled";

export type ShopTheme = {
  name: string;
  tagline: string;
  announcement: string;
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  heroImage: string;
  layout: ProductLayout;
  radius: number;
  currency: string;
  font: string;
};

export type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  salePrice?: number;
  inventory: number;
  image: string;
  featured: boolean;
};

export type ProductDraft = Omit<Product, "id" | "featured" | "salePrice"> & {
  featured: "yes" | "no";
  salePrice: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type Order = {
  id: string;
  buyerName: string;
  buyerEmail: string;
  total: number;
  itemCount: number;
  createdAt: string;
  status: OrderStatus;
};
