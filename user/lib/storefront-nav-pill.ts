import { cn } from "@/lib/utils";

/**
 * Same surface classes as {@link StorefrontTopNav} (Home / Shop / Cart pills).
 * Theme-aware via `.site-preview-root[data-theme]` + `pv-interactive` tokens.
 */
export function storefrontNavPillClassName(opts?: { active?: boolean }) {
  const active = opts?.active ?? false;
  return cn(
    "inline-flex items-center gap-1.5 rounded-(--pv-radius) px-3 py-1.5 text-sm font-medium tracking-tight transition-none",
    "text-pv-muted pv-interactive",
    active && "bg-pv-card text-pv-fg outline-1 outline-pv-border",
  );
}
