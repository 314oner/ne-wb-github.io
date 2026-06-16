import { CartItem, Product, ProductId, ShopId } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";

interface CartState {
  items: CartItem[];
}

const loadCart = (): CartItem[] => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("cart");
    if (stored) return JSON.parse(stored);
  }
  return [];
};

const saveCart = (items: CartItem[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("cart", JSON.stringify(items));
  }
};

const initialState: CartState = {
  items: loadCart(),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<{ product: Product; shopId: ShopId }>) {
      const { product, shopId } = action.payload;
      const existing = state.items.find((item) => item.product._id === product._id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ product, quantity: 1, shop: shopId });
      }
      saveCart(state.items);
    },
    removeFromCart(state, action: PayloadAction<ProductId>) {
      state.items = state.items.filter((item) => item.product._id !== action.payload);
      saveCart(state.items);
    },
    updateQuantity(state, action: PayloadAction<{ productId: ProductId; quantity: number }>) {
      const item = state.items.find((i) => i.product._id === action.payload.productId);
      if (item && action.payload.quantity > 0) {
        item.quantity = action.payload.quantity;
        saveCart(state.items);
      }
    },
    clearCart(state) {
      state.items = [];
      saveCart(state.items);
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartTotal = (state: RootState) => state.cart.items.reduce((total, item) => total + item.product.price * item.quantity, 0);
