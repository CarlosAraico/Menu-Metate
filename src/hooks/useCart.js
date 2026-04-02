import { useState, useCallback } from "react";

export function useCart() {
  const [items, setItems] = useState([]);

  const addItem = useCallback((product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product.productId);
      if (existing) return prev.map((i) => i.productId === product.productId ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((productId) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.productId !== productId));
    } else {
      setItems((prev) => prev.map((i) => i.productId === productId ? { ...i, quantity } : i));
    }
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return { items, addItem, removeItem, updateQuantity, clearCart, total, itemCount };
}
