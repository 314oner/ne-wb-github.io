import { Shop, ShopId } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";
import { createShop, deleteShop, fetchAllShops, fetchMyShops, fetchShopById, updateShop } from "../thunks/shop-thunks";

interface ShopState {
  shops: Shop[];
  myShops: Shop[];
  currentShop: Shop | null;
  loading: boolean;
  error: string | null;
}

const initialState: ShopState = {
  shops: [],
  myShops: [],
  currentShop: null,
  loading: false,
  error: null,
};

const shopSlice = createSlice({
  name: "shop",
  initialState,
  reducers: {
    clearCurrentShop(state) {
      state.currentShop = null;
    },
    clearShopError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllShops.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllShops.fulfilled, (state, action: PayloadAction<Shop[]>) => {
        // Добавляем только те моковые магазины которых ещё нет в стейте
        action.payload.forEach((mockShop) => {
          if (!state.shops.some((s) => s._id === mockShop._id)) {
            state.shops.push(mockShop);
          }
        });
        state.loading = false;
      })
      .addCase(fetchAllShops.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load shops";
      })
      .addCase(fetchShopById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShopById.fulfilled, (state, action: PayloadAction<Shop>) => {
        state.currentShop = action.payload;
        const existingIndex = state.shops.findIndex((s) => s._id === action.payload._id);
        if (existingIndex >= 0) {
          state.shops[existingIndex] = action.payload;
        } else {
          state.shops.push(action.payload);
        }
        state.loading = false;
      })
      .addCase(fetchShopById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Shop not found";
      })
      .addCase(fetchMyShops.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyShops.fulfilled, (state, action: PayloadAction<Shop[]>) => {
        state.myShops = action.payload;
        state.loading = false;
      })
      .addCase(fetchMyShops.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load your shops";
      })
      .addCase(createShop.pending, (state) => {
        state.loading = true;
      })
      .addCase(createShop.fulfilled, (state, action: PayloadAction<Shop>) => {
        state.myShops.push(action.payload);
        state.shops.push(action.payload); // чтобы работал позитиффффф
        state.loading = false;
      })
      .addCase(createShop.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create shop";
      })
      .addCase(updateShop.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        updateShop.fulfilled,
        (
          state,
          action: PayloadAction<{
            shopId: ShopId;
            name?: string;
            description?: string;
            image?: string;
          }>,
        ) => {
          const { shopId, name, description, image } = action.payload;
          const updateShopInList = (shop: Shop) => {
            if (shop._id === shopId) {
              if (name) shop.name = name;
              if (description) shop.description = description;
              if (image) shop.image = image;
              shop.updated = new Date().toISOString();
            }
          };
          const myShop = state.myShops.find((s) => s._id === shopId);
          if (myShop) updateShopInList(myShop);
          if (state.currentShop?._id === shopId) updateShopInList(state.currentShop);
          state.loading = false;
        },
      )
      .addCase(updateShop.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update shop";
      })
      .addCase(deleteShop.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteShop.fulfilled, (state, action: PayloadAction<ShopId>) => {
        state.myShops = state.myShops.filter((s) => s._id !== action.payload);
        if (state.currentShop?._id === action.payload) state.currentShop = null;
        state.loading = false;
      })
      .addCase(deleteShop.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete shop";
      });
  },
});

export const { clearCurrentShop, clearShopError } = shopSlice.actions;
export default shopSlice.reducer;

export const selectAllShops = (state: RootState) => state.shop.shops;
export const selectMyShops = (state: RootState) => state.shop.myShops;
export const selectCurrentShop = (state: RootState) => state.shop.currentShop;
export const selectShopLoading = (state: RootState) => state.shop.loading;
export const selectShopError = (state: RootState) => state.shop.error;
export const selectShopById = (shopId: ShopId) => (state: RootState) => state.shop.shops.find((shop) => shop._id === shopId);
