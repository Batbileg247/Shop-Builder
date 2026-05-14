import type { Product as DashboardProduct } from "@/types/dashboard";
import type { Product as StorefrontProduct, ProductDraft } from "@/types";
import type { NewProductInput } from "@/types/dashboard";

/** First seeded product per shop is featured in the preview grid. */
function isFeaturedSeed(d: DashboardProduct): boolean {
  return (
    d.id === "prod_luma_01" ||
    d.id === "prod_nova_01" ||
    d.id === "prod_terra_01"
  );
}

export function mapDashboardProductToStorefront(
  d: DashboardProduct,
): StorefrontProduct {
  return {
    id: d.id,
    name: d.name,
    category: d.category,
    size: d.size,
    description: d.description,
    price: d.price,
    inventory: d.inventory,
    image: d.imageUrl,
    featured: isFeaturedSeed(d),
  };
}

export function mapProductDraftToNewProductInput(
  d: ProductDraft,
): NewProductInput {
  const category = d.category.trim() || "Uncategorized";
  return {
    name: d.name.trim(),
    sku: "",
    category,
    size: d.size.trim(),
    description: d.description.trim(),
    imageUrl: d.image.trim(),
    status: Number(d.inventory) > 0 ? "Live" : "Draft",
    price: Number(d.price) || 0,
    inventory: Number(d.inventory) || 0,
  };
}
