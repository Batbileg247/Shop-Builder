import Link from "next/link";

import type { SiteProduct } from "@/lib/site-mock-products";
import { formatMnt } from "@/lib/site-mock-products";
import { cn } from "@/lib/utils";

export function ProductCard({
  product,
  href,
  className,
}: {
  product: SiteProduct;
  href?: string;
  className?: string;
}) {
  const inner = (
    <article
      className={cn(
        "pv-card flex h-full flex-col overflow-hidden transition-none",
        href && "h-full",
      )}
    >
      <div className="flex aspect-square items-center justify-center border-b border-pv-divider bg-pv-placeholder">
        <span className="text-xs font-medium uppercase tracking-wider text-pv-muted">
          {product.name.slice(0, 1)}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-[length:var(--pv-card-content-pad,1rem)]">
        <h3 className="line-clamp-2 text-sm font-medium leading-snug tracking-tight text-pv-fg">
          {product.name}
        </h3>
        <p className="text-xs text-pv-muted">{product.category}</p>
        <p className="mt-auto pt-2 text-sm font-semibold tabular-nums tracking-tight text-pv-fg">
          {formatMnt(product.price)} ₮
        </p>
      </div>
    </article>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={cn(
          "block min-h-0 rounded-[length:var(--pv-radius)] outline-none",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pv-border",
          "pv-interactive",
          className,
        )}
      >
        {inner}
      </Link>
    );
  }

  return <div className={className}>{inner}</div>;
}
