import { createContext, useContext, useState, useMemo } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  const addToCart = (jersey, size, quantity = 1) => {
    const id = jersey.id ?? jersey.jersey_id;
    const key = `${id}-${size}`;
    setItems((prev) => {
      const existing = prev.find((i) => `${i.jersey.id ?? i.jersey.jersey_id}-${i.size}` === key);
      if (existing) {
        return prev.map((i) =>
          `${i.jersey.id ?? i.jersey.jersey_id}-${i.size}` === key
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { jersey, size, quantity }];
    });
  };

  const removeFromCart = (jerseyId) => {
    setItems((prev) => prev.filter((i) => (i.jersey.id ?? i.jersey.jersey_id) !== jerseyId));
  };

  const updateQuantity = (jerseyId, quantity) => {
    if (quantity <= 0) return removeFromCart(jerseyId);
    setItems((prev) =>
      prev.map((i) =>
        (i.jersey.id ?? i.jersey.jersey_id) === jerseyId ? { ...i, quantity } : i
      )
    );
  };

  const clearCart = () => setItems([]);

  const cartCount = useMemo(
    () => items.reduce((acc, i) => acc + i.quantity, 0),
    [items]
  );

  const cartTotal = useMemo(
    () =>
      items.reduce((acc, i) => {
        const price = i.jersey.price ?? i.jersey.price_usd ?? 0;
        return acc + price * i.quantity;
      }, 0),
    [items]
  );

  const value = {
    cartItems: items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    cartCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
