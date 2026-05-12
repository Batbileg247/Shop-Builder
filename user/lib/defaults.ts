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
  {
    id: "felt-slippers",
    name: "Felt Slippers",
    category: "Home",
    description: "Hand-pressed wool felt with a soft indoor sole.",
    price: 52000,
    inventory: 22,
    image:
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1000&q=80",
    featured: true,
  },
  {
    id: "yak-beanie",
    name: "Yak Wool Beanie",
    category: "Accessories",
    description: "Dense rib knit that keeps heat without bulk.",
    price: 45000,
    salePrice: 39000,
    inventory: 18,
    image:
      "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=1000&q=80",
    featured: true,
  },
  {
    id: "ceramic-mug-set",
    name: "Ceramic Mug Set",
    category: "Home",
    description: "Two stackable mugs with a matte glaze finish.",
    price: 58000,
    inventory: 30,
    image:
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=1000&q=80",
    featured: true,
  },
  {
    id: "travel-pouch",
    name: "Travel Pouch",
    category: "Accessories",
    description: "Waxed canvas with a brass zip and interior pockets.",
    price: 76000,
    inventory: 15,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=80",
    featured: true,
  },
  {
    id: "merino-socks",
    name: "Merino Sock Pack",
    category: "Apparel",
    description: "Three pairs in neutral tones for daily wear.",
    price: 34000,
    inventory: 40,
    image:
      "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?auto=format&fit=crop&w=1000&q=80",
    featured: true,
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
