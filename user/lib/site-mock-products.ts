export type SiteProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  sizes: string[];
  colors: string[];
};

/** Minimal storefront — жишээ бараа (Featured + Shop grid + PDP). */
export const SITE_PRODUCTS: SiteProduct[] = [
  {
    id: "1",
    name: "Wireless earbuds",
    price: 89000,
    category: "Electronics",
    description:
      "Идэвхтэй дуу цуцлах, 32 цагийн суурь тоглуулалт. Ус нэвтрүүлэхгүй IPX4.",
    sizes: ["One size"],
    colors: ["Black", "White", "Navy"],
  },
  {
    id: "2",
    name: "USB-C hub",
    price: 125000,
    category: "Electronics",
    description:
      "7-в-1: HDMI 4K, USB-A x2, USB-C PD, SD/TF уншигч. Металл бие.",
    sizes: ["Standard"],
    colors: ["Space Gray", "Silver"],
  },
  {
    id: "3",
    name: "Desk mat",
    price: 45000,
    category: "Accessories",
    description: "900×400 мм, удаан эдэлгээтэй резин суурь, угсармал ирмэг.",
    sizes: ["M", "L", "XL"],
    colors: ["Charcoal", "Sand"],
  },
  {
    id: "4",
    name: "Mechanical keyboard",
    price: 289000,
    category: "Electronics",
    description: "Hot-swap switch, PBT keycap, USB-C detachable. 75% layout.",
    sizes: ["75%"],
    colors: ["Black", "White", "Graphite"],
  },
  {
    id: "5",
    name: "Webcam HD",
    price: 178000,
    category: "Electronics",
    description: "1080p60, авто focus, микрофон хослуулалт. Tripod mount.",
    sizes: ["One size"],
    colors: ["Black"],
  },
  {
    id: "6",
    name: "Laptop stand",
    price: 99000,
    category: "Accessories",
    description: "6 түвшин өнцөг, алюминий, 17\" хүртэл зөөврийн компьютер.",
    sizes: ["Regular", "Tall kit"],
    colors: ["Silver", "Black"],
  },
  {
    id: "7",
    name: "Noise monitor",
    price: 210000,
    category: "Electronics",
    description: "Орчны дуу хэмжигч, апп холболт, түүхийн график.",
    sizes: ["One size"],
    colors: ["White", "Gray"],
  },
  {
    id: "8",
    name: "Cable organizer",
    price: 22000,
    category: "Accessories",
    description: "Силикон 7-сувгийн удирдлага, ширээний доор наалт.",
    sizes: ["S", "L"],
    colors: ["Black", "White"],
  },
  {
    id: "9",
    name: "LED desk lamp",
    price: 134000,
    category: "Home",
    description: "CRI 95+, 5 цахилгаан түвшин, халуун/хүйтэн гэрэл.",
    sizes: ["Base", "Arm+"],
    colors: ["White", "Black"],
  },
  {
    id: "10",
    name: "Portable charger",
    price: 89000,
    category: "Electronics",
    description: "20000 mAh, 45W PD, 2x USB-C + 1x USB-A.",
    sizes: ["20Ah", "10Ah"],
    colors: ["Black", "White"],
  },
  {
    id: "11",
    name: "Mouse pad XL",
    price: 35000,
    category: "Accessories",
    description: "Stitched edge, удаан гулгах гадаргуу, 900×400 мм.",
    sizes: ["XL"],
    colors: ["Black", "Gray"],
  },
  {
    id: "12",
    name: "HDMI cable 2m",
    price: 18000,
    category: "Accessories",
    description: "Ultra High Speed HDMI 2.1, 48 Gbps, 8K60.",
    sizes: ["1m", "2m", "3m"],
    colors: ["Black"],
  },
];

export const SITE_CATEGORIES = [
  "All",
  ...Array.from(new Set(SITE_PRODUCTS.map((p) => p.category))),
] as const;

export function formatMnt(n: number) {
  return new Intl.NumberFormat("mn-MN", {
    maximumFractionDigits: 0,
  }).format(n);
}

export function getSiteProductById(id: string): SiteProduct | undefined {
  return SITE_PRODUCTS.find((p) => p.id === id);
}
