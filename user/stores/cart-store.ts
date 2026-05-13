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

type CartStore = {
  lines: CartLine[];
  addItem: (args: {
    productId: string;
    name: string;
    price: number;
    size: string;
    color: string;
    quantity?: number;
  }) => void;
  removeLine: (lineId: string) => void;
  setLineQuantity: (lineId: string, quantity: number) => void;
  clear: () => void;
};

export function makeCartLineId(productId: string, size: string, color: string) {
  return `${productId}__${size}__${color}`;
}

export const useCartStore = create<CartStore>((set) => ({
  lines: [],
  addItem: ({ productId, name, price, size, color, quantity = 1 }) => {
    const lineId = makeCartLineId(productId, size, color);
    set((s) => {
      const i = s.lines.findIndex((l) => l.lineId === lineId);
      if (i >= 0) {
        const next = [...s.lines];
        next[i] = {
          ...next[i],
          quantity: next[i].quantity + quantity,
        };
        return { lines: next };
      }
      return {
        lines: [
          ...s.lines,
          { lineId, productId, name, price, size, color, quantity },
        ],
      };
    });
  },
  removeLine: (lineId) =>
    set((s) => ({ lines: s.lines.filter((l) => l.lineId !== lineId) })),
  setLineQuantity: (lineId, quantity) =>
    set((s) => {
      if (quantity <= 0) {
        return { lines: s.lines.filter((l) => l.lineId !== lineId) };
      }
      return {
        lines: s.lines.map((l) =>
          l.lineId === lineId ? { ...l, quantity } : l,
        ),
      };
    }),
  clear: () => set({ lines: [] }),
}));

export function selectCartItemCount(state: CartStore): number {
  return state.lines.reduce((n, l) => n + l.quantity, 0);
}

export function selectCartSubtotal(state: CartStore): number {
  return state.lines.reduce((n, l) => n + l.price * l.quantity, 0);
}
