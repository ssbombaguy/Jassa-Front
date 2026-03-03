import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { placeOrder } from "../../api/ordersApi";

export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (orderPayload, { rejectWithValue }) => {
    try {
      return await placeOrder(orderPayload);
    } catch (error) {
      return rejectWithValue({
        message: error.message || "Failed to place order.",
        errors: error.errors || [],
      });
    }
  }
);

const initialState = {
  placing: false,
  success: false,
  order: null,
  error: null,
  validationErrors: [],
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    resetOrderState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.placing = true;
        state.success = false;
        state.error = null;
        state.validationErrors = [];
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.placing = false;
        state.success = true;
        state.order = action.payload?.data || action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.placing = false;
        state.success = false;
        state.error = action.payload?.message || action.error.message || "Failed to place order.";
        state.validationErrors = action.payload?.errors || [];
      });
  },
});

export const { resetOrderState } = ordersSlice.actions;
export default ordersSlice.reducer;
