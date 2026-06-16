import "./enableImmerPlugins";

import { Action, combineReducers, configureStore, ThunkAction } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { logger } from "redux-logger";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import auctionReducer from "./slices/auction-slice";
import cartReducer from "./slices/cart-slice";
import orderReducer from "./slices/order-slice";
import productReducer from "./slices/product-slice";
import shopReducer from "./slices/shop-slice";
import userReducer from "./slices/user-slice";

const persistConfig = {
  key: "root",
  storage,
  version: 1,
  whitelist: [],
};

const rootReducer = combineReducers({
  product: productReducer,
  cart: cartReducer,
  user: userReducer,
  order: orderReducer,
  shop: shopReducer,
  auction: auctionReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(logger as any),
  devTools: true,
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
export type ErrorState = { error: string };

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export function configureAppStore() {
  return store;
}

export * from "./slices/auction-slice";
export * from "./slices/cart-slice";
export * from "./slices/order-slice";
export * from "./slices/product-slice";
export * from "./slices/shop-slice";
export * from "./slices/user-slice";

export * from "./thunks/auction-thunks";
export * from "./thunks/order-thunks";
export * from "./thunks/product-thunks";
export * from "./thunks/shop-thunks";
