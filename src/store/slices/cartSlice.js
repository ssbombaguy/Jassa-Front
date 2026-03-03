// File: src/store/slices/cartSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  isOpen: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, selectedSize } = action.payload;
      const existingItem = state.items.find(
        (item) => item.id === product.id && item.selectedSize === selectedSize
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({
          id: product.id,
          name: product.name,
          brand: product.brand,
          price: product.price,
          image: product.image,
          selectedSize,
          quantity: 1,
        });
      }
    },

    removeFromCart: (state, action) => {
      const { id, selectedSize } = action.payload;
      state.items = state.items.filter(
        (item) => !(item.id === id && item.selectedSize === selectedSize)
      );
    },

    increaseQuantity: (state, action) => {
      const { id, selectedSize } = action.payload;
      const item = state.items.find(
        (i) => i.id === id && i.selectedSize === selectedSize
      );
      if (item) item.quantity += 1;
    },

    decreaseQuantity: (state, action) => {
      const { id, selectedSize } = action.payload;
      const item = state.items.find(
        (i) => i.id === id && i.selectedSize === selectedSize
      );
      if (item) {
        if (item.quantity === 1) {
          state.items = state.items.filter(
            (i) => !(i.id === id && i.selectedSize === selectedSize)
          );
        } else {
          item.quantity -= 1;
        }
      }
    },

    clearCart: (state) => {
      state.items = [];
    },

    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },

    openCart: (state) => {
      state.isOpen = true;
    },

    closeCart: (state) => {
      state.isOpen = false;
    },
  },
});

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartCount = (state) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);
export const selectCartTotal = (state) =>
  state.cart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
export const selectCartIsOpen = (state) => state.cart.isOpen;

export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
  toggleCart,
  openCart,
  closeCart,
} = cartSlice.actions;

export default cartSlice.reducer;
