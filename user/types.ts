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
  /** Primary hero slide (Unsplash or any image URL). */
  heroImage: string;
  /** Extra hero-only carousel URLs (one slide each); not product photos. */
  heroGallery: string[];
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

/** One selectable option for a multiselect storefront filter (admin-defined). */
export type CatalogFilterOption = {
  id: string;
  label: string;
  /**
   * How to match products:
   * - Exact string → `product.category === matchValue`
   * - `__sale__` → product has `salePrice`
   */
  matchValue: string;
};

export type CatalogMultiselectFilter = {
  id: string;
  type: "multiselect";
  label: string;
  options: CatalogFilterOption[];
};

export type CatalogPriceRangeFilter = {
  id: string;
  type: "priceRange";
  label: string;
  /** Default / max bounds in raw price units (same as `Product.price`). */
  min: number;
  max: number;
};

export type CatalogFilterDefinition =
  | CatalogMultiselectFilter
  | CatalogPriceRangeFilter;
