import { createContext, useContext, useState, useMemo, useEffect } from 'react';

const CartContext = createContext(null);

const STORAGE_KEY = 'jasssport_cart';

const loadFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveToStorage = (items) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // storage full or blocked — fail silently
  }
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => loadFromStorage());

  // persist on every change
  useEffect(() => {
    saveToStorage(items);
  }, [items]);

  const getId = (jersey) => jersey?.product_id ?? jersey?.jersey_id ?? jersey?.id;

  const addToCart = (jersey, size, quantity = 1) => {
    const id  = getId(jersey);
    const key = `${id}-${size}`;
    setItems((prev) => {
      const existing = prev.find(
        (i) => `${getId(i.jersey)}-${i.size}` === key
      );
      if (existing) {
        return prev.map((i) =>
          `${getId(i.jersey)}-${i.size}` === key
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { jersey, size, quantity }];
    });
  };

  const removeFromCart = (id) => {
    setItems((prev) => prev.filter((i) => getId(i.jersey) !== id));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) return removeFromCart(id);
    setItems((prev) =>
      prev.map((i) => getId(i.jersey) === id ? { ...i, quantity } : i)
    );
  };

  const clearCart = () => setItems([]);

  const cartCount = useMemo(
    () => items.reduce((acc, i) => acc + i.quantity, 0),
    [items]
  );

  const cartTotal = useMemo(
    () => items.reduce((acc, i) => {
      const price = i.jersey?.price ?? i.jersey?.price_usd ?? 0;
      return acc + Number(price) * i.quantity;
    }, 0),
    [items]
  );

  return (
    <CartContext.Provider value={{
      cartItems: items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      cartCount,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};