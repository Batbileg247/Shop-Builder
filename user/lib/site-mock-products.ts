export type SiteProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  sizes: string[];
  colors: string[];
};

export const SITE_CATEGORIES = [
  "All",
  "Apparel",
  "Accessories",
  "Home",
] as const;

export const SITE_PRODUCTS: SiteProduct[] = [
  {
    id: "mock-tee-1",
    name: "Classic Tee",
    description: "Универсал цамц.",
    price: 89000,
    category: "Apparel",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "White", "Navy"],
  },
  {
    id: "mock-hoodie-1",
    name: "Fleece Hoodie",
    description: "Дулаан hoodie.",
    price: 189000,
    category: "Apparel",
    sizes: ["M", "L", "XL"],
    colors: ["Gray", "Black"],
  },
  {
    id: "mock-cap-1",
    name: "Canvas Cap",
    description: "Нарны малгай.",
    price: 45000,
    category: "Accessories",
    sizes: ["One size"],
    colors: ["Khaki", "Black"],
  },
  {
    id: "mock-mug-1",
    name: "Ceramic Mug",
    description: "Цайны аяга.",
    price: 32000,
    category: "Home",
    sizes: ["One size"],
    colors: ["Cream", "Charcoal"],
  },
];

export function getSiteProductById(id: string): SiteProduct | undefined {
  return SITE_PRODUCTS.find((p) => p.id === id);
}

export function formatMnt(amount: number): string {
  return new Intl.NumberFormat("mn-MN", {
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}
