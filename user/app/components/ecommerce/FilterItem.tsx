"use client";

import { cn } from "@/lib/utils";

export function FilterItem({
  id,
  label,
  checked,
  onChange,
  disabled,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center gap-2 rounded-md px-1 py-1.5 text-sm text-zinc-800 transition hover:bg-zinc-100",
        disabled && "pointer-events-none opacity-50",
      )}
    >
      <input
        checked={checked}
        className="size-4 rounded border-zinc-300 text-zinc-900"
        id={id}
        onChange={(e) => onChange(e.target.checked)}
        type="checkbox"
      />
      <span className="select-none">{label}</span>
    </label>
  );
}
