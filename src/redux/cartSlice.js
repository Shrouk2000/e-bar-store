import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api, token } from "../api/axiosInstance";

export const fetchCart = createAsyncThunk("cart/fetchCart", async () => {
  const response = await api.get(`/cart/index?token=${token}`);
  return response.data;
});

export const updateCart = createAsyncThunk("cart/updateCart", async ({ bar_id, action }) => {
  const response = await api.post("/cart/store", { bar_id, action, token });
  return response.data;
});

export const clearCart = createAsyncThunk("cart/clearCart", async () => {
  await api.get(`/cart/clear-cart?token=${token}`);
  return [];
});

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
      });
  },
});

export default cartSlice.reducer;