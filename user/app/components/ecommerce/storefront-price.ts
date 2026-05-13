/** Maps catalog integers to a compact USD-style demo for the storefront UI. */
export function formatStorefrontPrice(value: number): string {
  const v = value / 1000;
  return `$${v.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
