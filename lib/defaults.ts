import type { Product, ProductDraft, ShopTheme } from "@/types";
import { IMAGE_FALLBACK } from "@/lib/utils";

export const defaultTheme: ShopTheme = {
  name: "Nomad Goods",
  tagline: "Everyday pieces with a Mongolian point of view.",
  announcement: "Free delivery in Ulaanbaatar this week",
  primaryColor: "#047857",
  accentColor: "#f97316",
  backgroundColor: "#f8fafc",
  textColor: "#18181b",
  heroImage:
    "https://images.unsplash.com/photo-1523381294911-8d3cead13475?auto=format&fit=crop&w=1600&q=80",
  layout: "grid",
  radius: 6,
  currency: "₮",
  font: "sans",
};

export const defaultProducts: Product[] = [
  {
    id: "cashmere-cardigan",
    name: "Cashmere Cardigan",
    category: "Apparel",
    description: "Soft midweight knit for cold mornings and clean layering.",
    price: 189000,
    inventory: 14,
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80",
    featured: true,
  },
  {
    id: "leather-tote",
    name: "Leather Tote",
    category: "Accessories",
    description: "Structured carryall with room for a laptop and daily kit.",
    price: 149000,
    salePrice: 119000,
    inventory: 8,
    image:
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=80",
    featured: true,
  },
  {
    id: "wool-scarf",
    name: "Wool Scarf",
    category: "Seasonal",
    description: "Warm woven texture in a simple, giftable size.",
    price: 69000,
    inventory: 3,
    image:
      "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=1000&q=80",
    featured: false,
  },
];

export const emptyDraft: ProductDraft = {
  name: "",
  category: "",
  description: "",
  price: 99000,
  salePrice: "",
  inventory: 10,
  image: IMAGE_FALLBACK,
  featured: "yes",
};
