import Link from "next/link";

import { ShopPage } from "@/components/site/shop-page";

/**
 * Theme-preview shop (mock products + Zustand cart). Full `useShop` catalog +
 * admin filters: `/builder/catalog`.
 */
export default function BuilderShopPage() {
  return (
    <div className="flex flex-col">
      <div className="border-b border-pv-divider bg-pv-surface/80 px-6 py-3 text-center text-sm text-pv-muted">
        <span className="text-pv-fg">Preview shop</span>
        {" · "}
        <Link
          className="font-medium text-pv-fg underline-offset-4 hover:underline"
          href="/builder/catalog"
        >
          Open shop builder catalog
        </Link>
        {" · "}
        <Link
          className="font-medium text-pv-fg underline-offset-4 hover:underline"
          href="/builder/panel"
        >
          Builder / admin panel
        </Link>
      </div>
      <ShopPage />
    </div>
  );
}
