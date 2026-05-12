import type { ReactNode } from "react";

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-2 text-base font-medium text-zinc-700">
      <span>{label}</span>
      {children}
    </div>
  );
}

const badgeClass: Record<
  "zinc" | "amber" | "green" | "red" | "blue",
  string
> = {
  zinc: "border-zinc-200 bg-zinc-100 text-zinc-800",
  amber: "border-amber-200 bg-amber-100 text-amber-900",
  green: "border-emerald-200 bg-emerald-100 text-emerald-900",
  red: "border-red-200 bg-red-100 text-red-900",
  blue: "border-blue-200 bg-blue-100 text-blue-900",
};

export function Badge({
  color,
  children,
}: {
  color: keyof typeof badgeClass;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold capitalize ${badgeClass[color]}`}
    >
      {children}
    </span>
  );
}

export function ColorField({
  label,
  onChange,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <label className="grid gap-2 text-base font-medium text-zinc-700">
      <span>{label}</span>
      <div className="flex items-center gap-2 rounded-md border border-zinc-300 bg-white p-1 shadow-sm">
        <input
          className="h-8 w-8 cursor-pointer rounded border-0 bg-transparent p-0"
          onChange={(e) => onChange(e.target.value)}
          type="color"
          value={value}
        />
        <span className="font-mono text-sm text-zinc-500">{value}</span>
      </div>
    </label>
  );
}

export function Metric({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-md border border-black/10 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium uppercase tracking-wider text-zinc-400">
        {label}
      </p>
      <p className="mt-1 text-3xl font-semibold tracking-tight">{value}</p>
      {sub && <p className="mt-1 text-sm text-zinc-500">{sub}</p>}
    </div>
  );
}
