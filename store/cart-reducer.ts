import { ISaleItem } from "@/types/sale";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface CartState {
  cart: ISaleItem[];
  cartTotal: number;
  cartCount: number;
}

const initialState: CartState = {
  cart: [] as ISaleItem[],
  cartTotal: 0,
  cartCount: 0,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<ISaleItem>) => {
      const productTobeAdded = action.payload;

      state.cart.push(productTobeAdded);
      state.cartCount += 1;
      state.cartTotal += productTobeAdded.amount;
    },
    removeFromCart: (state, action: PayloadAction<ISaleItem>) => {
      state.cart = state.cart.filter(
        (product) => product.productId !== action.payload.productId
      );
      state.cartCount -= 1;
      state.cartTotal -= action.payload.amount;
    },
    addQuantity: (state, action: PayloadAction<ISaleItem>) => {
      const productIndex = state.cart.findIndex(
        (product) => product.productId === action.payload.productId
      );
      state.cart[productIndex].quantity += 1;
      // Update the  amount of the product
      state.cart[productIndex].amount =
        state.cart[productIndex].quantity *
        state.cart[productIndex].sellingPrice;
      state.cartTotal += state.cart[productIndex].sellingPrice;
    },

    subtractQuantity: (state, action: PayloadAction<ISaleItem>) => {
      const productIndex = state.cart.findIndex(
        (product) => product.productId === action.payload.productId
      );
      if (state.cart[productIndex].quantity > 1) {
        state.cart[productIndex].quantity -= 1;
        state.cartTotal -= state.cart[productIndex].sellingPrice;
        // Update the  amount of the product
        state.cart[productIndex].amount =
          state.cart[productIndex].quantity *
          state.cart[productIndex].sellingPrice;
      }
    },

    clearCart: (state) => {
      state.cart = [];
      state.cartCount = 0;
      state.cartTotal = 0;
    },
  },
});

export const storeCartActions = cartSlice.actions;
export type CartActions = typeof cartSlice.actions;
export default cartSlice.reducer;
