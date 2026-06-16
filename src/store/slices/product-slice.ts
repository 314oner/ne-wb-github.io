import { Product, ProductId } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";
import {
  createProduct,
  deleteProduct,
  fetchCategories,
  fetchLatestProducts,
  fetchProductById,
  fetchRelatedProducts,
  fetchShopProducts,
  searchProducts,
  updateProduct,
} from "../thunks/product-thunks";

interface ProductState {
  latest: Product[];
  categories: string[];
  searchResults: Product[];
  searched: boolean;
  currentProduct: Product | null;
  relatedProducts: Product[];
  shopProducts: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  latest: [],
  categories: [],
  searchResults: [],
  searched: false,
  currentProduct: null,
  relatedProducts: [],
  shopProducts: [],
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    clearSearch(state) {
      state.searchResults = [];
      state.searched = false;
    },
    clearCurrentProduct(state) {
      state.currentProduct = null;
      state.relatedProducts = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLatestProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLatestProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.latest = action.payload;
        state.loading = false;
      })
      .addCase(fetchLatestProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch latest products";
      })
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<string[]>) => {
        state.categories = action.payload;
      })
      .addCase(searchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.searchResults = action.payload;
        state.searched = true;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductById.fulfilled, (state, action: PayloadAction<Product>) => {
        state.currentProduct = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Product not found";
      })
      .addCase(fetchRelatedProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.relatedProducts = action.payload;
      })
      .addCase(fetchShopProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.shopProducts = action.payload;
      })
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.shopProducts.unshift(action.payload);
        state.loading = false;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create product";
      })
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        updateProduct.fulfilled,
        (
          state,
          action: PayloadAction<{
            productId: ProductId;
            updatedProduct: Partial<Product>;
          }>,
        ) => {
          const { productId, updatedProduct } = action.payload;
          const index = state.shopProducts.findIndex((p) => p._id === productId);
          if (index !== -1) {
            state.shopProducts[index] = {
              ...state.shopProducts[index],
              ...updatedProduct,
            };
          }
          if (state.currentProduct?._id === productId) {
            state.currentProduct = {
              ...state.currentProduct,
              ...updatedProduct,
            };
          }
          state.loading = false;
        },
      )
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update product";
      })
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<ProductId>) => {
        state.shopProducts = state.shopProducts.filter((p) => p._id !== action.payload);
        if (state.currentProduct?._id === action.payload) state.currentProduct = null;
        state.loading = false;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete product";
      });
  },
});

export const { clearSearch, clearCurrentProduct } = productSlice.actions;
export default productSlice.reducer;

export const selectLatestProducts = (state: RootState) => state.product.latest;
export const selectCategories = (state: RootState) => state.product.categories;
export const selectSearchResults = (state: RootState) => state.product.searchResults;
export const selectSearched = (state: RootState) => state.product.searched;
export const selectCurrentProduct = (state: RootState) => state.product.currentProduct;
export const selectRelatedProducts = (state: RootState) => state.product.relatedProducts;
export const selectShopProducts = (state: RootState) => state.product.shopProducts;
export const selectProductLoading = (state: RootState) => state.product.loading;
export const selectProductError = (state: RootState) => state.product.error;
