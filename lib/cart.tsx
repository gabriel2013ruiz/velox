"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { bundles, Bundle } from "./products";

export interface CartItem {
  id: string;
  qty: number; // number of this bundle in cart
}

interface CartCtx {
  items: CartItem[];
  open: boolean;
  setOpen: (o: boolean) => void;
  add: (bundleId: string) => void;
  remove: (bundleId: string) => void;
  setQty: (bundleId: string, qty: number) => void;
  clear: () => void;
  count: number;
  toast: string | null;
  fireToast: (msg: string) => void;
  detailed: { bundle: Bundle; qty: number }[];
}

const Ctx = createContext<CartCtx | null>(null);
const KEY = "velox_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const fireToast = useCallback((msg: string) => {
    setToast(msg);
    window.clearTimeout((fireToast as unknown as { _t?: number })._t);
    (fireToast as unknown as { _t?: number })._t = window.setTimeout(() => setToast(null), 2200);
  }, []);

  const add = useCallback((bundleId: string) => {
    setItems((prev) => {
      const found = prev.find((i) => i.id === bundleId);
      if (found) return prev.map((i) => (i.id === bundleId ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, { id: bundleId, qty: 1 }];
    });
  }, []);

  const remove = useCallback((bundleId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== bundleId));
  }, []);

  const setQty = useCallback((bundleId: string, qty: number) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.id !== bundleId)
        : prev.map((i) => (i.id === bundleId ? { ...i, qty } : i))
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const count = items.reduce((a, i) => a + i.qty, 0);

  const detailed = items
    .map((i) => {
      const bundle = bundles.find((b) => b.id === i.id);
      return bundle ? { bundle, qty: i.qty } : null;
    })
    .filter(Boolean) as { bundle: Bundle; qty: number }[];

  return (
    <Ctx.Provider value={{ items, open, setOpen, add, remove, setQty, clear, count, toast, fireToast, detailed }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
