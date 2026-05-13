"use client";

import { SearchIcon, ShoppingBagIcon, StarIcon, UserIcon } from "lucide-react";
import { Button } from "@/ui/button";

export function StorefrontHeader({
  brandName,
  cartCount,
  onOpenCart,
}: {
  brandName: string;
  cartCount: number;
  onOpenCart: () => void;
}) {
  return (
    <header className="flex shrink-0 items-center justify-between gap-4 border-b border-zinc-200 bg-white px-4 py-4 sm:px-6">
      <p className="font-serif text-xl font-semibold tracking-tight text-zinc-900 sm:text-2xl">
        {brandName}
      </p>
      <nav className="hidden items-center gap-8 text-sm font-medium text-zinc-600 md:flex">
        <span className="cursor-default hover:text-zinc-900">Home</span>
        <span className="cursor-default border-b border-black pb-0.5 text-zinc-900">
          Shop
        </span>
        <span className="cursor-default hover:text-zinc-900">Products</span>
        <span className="cursor-default hover:text-zinc-900">Pages ▾</span>
      </nav>
      <div className="flex items-center gap-1 sm:gap-2">
        <Button className="text-zinc-600" size="icon" variant="ghost">
          <SearchIcon className="size-5" />
        </Button>
        <Button className="text-zinc-600" size="icon" variant="ghost">
          <UserIcon className="size-5" />
        </Button>
        <Button className="text-zinc-600" size="icon" variant="ghost">
          <StarIcon className="size-5" />
        </Button>
        <Button
          className="relative text-zinc-900"
          onClick={onOpenCart}
          size="icon"
          variant="ghost"
        >
          <ShoppingBagIcon className="size-5" />
          {cartCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
              {cartCount > 9 ? "9+" : cartCount}
            </span>
          )}
        </Button>
      </div>
    </header>
  );
}
