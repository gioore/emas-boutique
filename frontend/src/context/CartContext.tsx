'use client';

import { createContext, useContext, useState, useCallback, useMemo, useEffect, type ReactNode } from 'react';

export interface CartItem {
  id: number;
  name: string;
  slug: string;
  price: number;
  size: string;
  color?: string;
  quantity: number;
  image: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (productId: number, size: string) => void;
  updateQuantity: (productId: number, size: string, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'emas-cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, hydrated]);

  const addItem = useCallback((newItem: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    setItems(prev => {
      const existing = prev.find(
        i => i.id === newItem.id && i.size === newItem.size && i.color === newItem.color
      );
      if (existing) {
        return prev.map(i =>
          i.id === newItem.id && i.size === newItem.size && i.color === newItem.color
            ? { ...i, quantity: i.quantity + (newItem.quantity || 1) }
            : i
        );
      }
      return [...prev, { ...newItem, quantity: newItem.quantity || 1 }];
    });
  }, []);

  const removeItem = useCallback((productId: number, size: string) => {
    setItems(prev => prev.filter(i => !(i.id === productId && i.size === size)));
  }, []);

  const updateQuantity = useCallback((productId: number, size: string, qty: number) => {
    setItems(prev =>
      prev.map(i =>
        i.id === productId && i.size === size ? { ...i, quantity: Math.max(1, qty) } : i
      )
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);
  const totalPrice = useMemo(() => items.reduce((sum, i) => sum + i.price * i.quantity, 0), [items]);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
