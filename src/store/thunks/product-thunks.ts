import type { CreateProductDto, Product, ProductId, ShopId, UpdateProductDto } from "@/types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../index";
import { filterProducts, mockCategories, mockLatestProducts, mockProducts, mockRelatedProducts, mockShopProducts } from "../mocks/product-mocks";

export const fetchLatestProducts = createAsyncThunk<Product[], void, { state: RootState }>("product/fetchLatest", async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockLatestProducts;
});

export const fetchCategories = createAsyncThunk<string[], void, { state: RootState }>("product/fetchCategories", async () => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return [...mockCategories];
});

export const searchProducts = createAsyncThunk<Product[], { search?: string; category?: string }, { state: RootState }>(
  "product/search",
  async ({ search, category }) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return filterProducts(mockLatestProducts, { search, category });
  },
);

export const fetchProductById = createAsyncThunk<Product, ProductId, { state: RootState }>("product/fetchById", async (productId) => {
  await new Promise((resolve) => setTimeout(resolve, 400));
  const product = mockProducts.find((p) => p._id === productId);
  if (!product) throw new Error("Product not found");
  return product;
});

export const fetchRelatedProducts = createAsyncThunk<Product[], ProductId, { state: RootState }>("product/fetchRelated", async () => {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return mockRelatedProducts;
});

export const fetchShopProducts = createAsyncThunk<Product[], ShopId, { state: RootState }>("product/fetchShopProducts", async (shopId) => {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return mockShopProducts.filter((p) => p.shop._id === shopId);
});

export const createProduct = createAsyncThunk<Product, CreateProductDto, { state: RootState }>("product/create", async (productData) => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  //const currentUser = getState().user.current;
  const newProduct: Product = {
    _id: Math.random().toString(36).substring(7) as ProductId,
    name: productData.name,
    description: productData.description || "",
    category: productData.category || "",
    quantity: productData.quantity,
    price: productData.price,
    image: "/images/placeholder.jpg",
    shop: { _id: "s1" as ShopId, name: "Mock Shop" },
    created: new Date().toISOString(),
  };
  return newProduct;
});

export const updateProduct = createAsyncThunk<
  { productId: ProductId; updatedProduct: Partial<Product> },
  { productId: ProductId; productData: UpdateProductDto },
  { state: RootState }
>("product/update", async ({ productId, productData }) => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  const { image, ...rest } = productData;
  const updatedFields: Partial<Product> = {
    ...rest,
    ...(image ? { image: "/images/updated-product.jpg" } : {}),
  };
  return { productId, updatedProduct: updatedFields };
});

export const deleteProduct = createAsyncThunk<ProductId, ProductId, { state: RootState }>("product/delete", async (productId) => {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return productId;
});
