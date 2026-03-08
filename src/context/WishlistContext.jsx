import { createContext, useContext, useState, useMemo, useEffect } from 'react';

const WishlistContext = createContext(null);

const STORAGE_KEY = 'jasssport_wishlist';

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

export const WishlistProvider = ({ children }) => {
  const [items, setItems] = useState(() => loadFromStorage());

  // persist on every change
  useEffect(() => {
    saveToStorage(items);
  }, [items]);

  const getId = (item) => item?.product_id ?? item?.jersey_id ?? item?.id;

  const addToWishlist = (item) => {
    const id = getId(item);
    setItems((prev) => {
      if (prev.some((i) => getId(i) === id)) return prev;
      return [...prev, item];
    });
  };

  const removeFromWishlist = (id) => {
    setItems((prev) => prev.filter((i) => getId(i) !== id));
  };

  const toggleWishlist = (item) => {
    const id = getId(item);
    setItems((prev) => {
      const exists = prev.some((i) => getId(i) === id);
      if (exists) return prev.filter((i) => getId(i) !== id);
      return [...prev, item];
    });
  };

  const isWishlisted = (id) => items.some((i) => getId(i) === id);

  const clearWishlist = () => setItems([]);

  const wishlistCount = useMemo(() => items.length, [items]);

  return (
    <WishlistContext.Provider value={{
      wishlistItems: items,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      isWishlisted,
      clearWishlist,
      wishlistCount,
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
};