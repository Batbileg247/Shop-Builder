import { cn } from "@/lib/utils";

/** Shared primary CTA look for View Demo / Back to Editor in the builder preview. */
export function builderDemoCtaButtonClassName(extra?: string) {
  return cn(
    "h-9 rounded-[length:var(--pv-radius)] border-0",
    "!bg-gradient-to-r !from-violet-600 !via-indigo-600 !to-violet-600 !text-white",
    "shadow-[0_4px_14px_rgba(109,40,217,0.45)] ring-2 ring-violet-300/40",
    "gap-2 px-4 font-semibold tracking-tight",
    "hover:!brightness-110 hover:!shadow-[0_6px_20px_rgba(79,70,229,0.5)]",
    "active:scale-[0.98] active:!brightness-95",
    extra,
  );
}
