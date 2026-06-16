import type { CreateShopDto, Shop, ShopId, UpdateShopDto, UserId } from "@/types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../index";
import { mockShops } from "../mocks/shop-mocks";

export const fetchAllShops = createAsyncThunk<Shop[], void, { state: RootState }>("shop/fetchAll", async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockShops;
});

export const fetchShopById = createAsyncThunk<Shop, ShopId, { state: RootState }>("shop/fetchById", async (shopId, { getState }) => {
  await new Promise((resolve) => setTimeout(resolve, 400));

  const existing = getState().shop.shops.find((s) => s._id === shopId);
  if (existing) return existing;

  const shop = mockShops.find((s) => s._id === shopId);
  if (!shop) throw new Error("Shop not found");
  return shop;
});

export const fetchMyShops = createAsyncThunk<Shop[], UserId, { state: RootState }>("shop/fetchMyShops", async (userId) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockShops.filter((s) => s.owner._id === userId);
});

export const createShop = createAsyncThunk<Shop, CreateShopDto, { state: RootState }>("shop/create", async (formData, { getState }) => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  const currentUser = getState().user.current;
  const newShop: Shop = {
    _id: `shop_${Date.now()}` as ShopId,
    name: formData.name,
    description: formData.description,
    image: "/images/default-shop.jpg",
    owner: {
      _id: currentUser?._id ?? ("anonymous" as UserId),
      name: currentUser?.name ?? "Anonymous",
    },
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
  };
  return newShop;
});

export const updateShop = createAsyncThunk<
  { shopId: ShopId; name?: string; description?: string; image?: string },
  { shopId: ShopId; formData: UpdateShopDto },
  { state: RootState }
>("shop/update", async ({ shopId, formData }) => {
  await new Promise((resolve) => setTimeout(resolve, 700));
  const { image, ...rest } = formData;
  const updatedImage: string | undefined = image ? "/images/updated-logo.png" : undefined;
  return { shopId, ...rest, image: updatedImage };
});

export const deleteShop = createAsyncThunk<ShopId, ShopId, { state: RootState }>("shop/delete", async (shopId) => {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return shopId;
});
