import { cn } from "@/lib/utils";

export function StarRating({
  rating,
  className,
}: {
  rating: number;
  className?: string;
}) {
  const full = Math.floor(rating);
  const partial = rating - full >= 0.5;
  return (
    <span className={cn("inline-flex text-amber-400", className)} aria-hidden>
      {Array.from({ length: 5 }, (_, i) => {
        if (i < full) return <span key={i}>★</span>;
        if (i === full && partial) return <span key={i}>★</span>;
        return (
          <span className="text-zinc-200" key={i}>
            ★
          </span>
        );
      })}
    </span>
  );
}
