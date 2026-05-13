"use client";

import { create } from "zustand";

export type CartLine = {
  lineId: string;
  productId: string;
  name: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
};

type CartAddPayload = {
  productId: string;
  name: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
};

type CartState = {
  lines: CartLine[];
  addItem: (item: CartAddPayload) => void;
  removeLine: (lineId: string) => void;
  setLineQuantity: (lineId: string, quantity: number) => void;
  clear: () => void;
};

function lineKey(productId: string, size: string, color: string) {
  return `${productId}|${size}|${color}`;
}

export const useCartStore = create<CartState>((set) => ({
  lines: [],
  addItem: (item) =>
    set((state) => {
      const key = lineKey(item.productId, item.size, item.color);
      const existing = state.lines.find(
        (l) => lineKey(l.productId, l.size, l.color) === key,
      );
      if (existing) {
        return {
          lines: state.lines.map((l) =>
            l.lineId === existing.lineId
              ? { ...l, quantity: l.quantity + item.quantity }
              : l,
          ),
        };
      }
      const lineId =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `line-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      return {
        lines: [
          ...state.lines,
          {
            lineId,
            productId: item.productId,
            name: item.name,
            price: item.price,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
          },
        ],
      };
    }),
  removeLine: (lineId) =>
    set((state) => ({
      lines: state.lines.filter((l) => l.lineId !== lineId),
    })),
  setLineQuantity: (lineId, quantity) =>
    set((state) => {
      const q = Math.max(0, Math.floor(quantity));
      if (q <= 0) {
        return { lines: state.lines.filter((l) => l.lineId !== lineId) };
      }
      return {
        lines: state.lines.map((l) =>
          l.lineId === lineId ? { ...l, quantity: q } : l,
        ),
      };
    }),
  clear: () => set({ lines: [] }),
}));

export function selectCartSubtotal(state: CartState): number {
  return state.lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
}
