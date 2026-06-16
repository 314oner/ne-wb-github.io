import { Order, OrderItemStatus, UpdateStatusPayload } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";
import {
  cancelOrderItem,
  createOrder,
  fetchOrderById,
  fetchShopOrders,
  fetchStatusValues,
  fetchUserOrders,
  processChargeForItem,
  updateOrderItemStatus,
} from "../thunks/order-thunks";

interface OrderState {
  userOrders: Order[];
  currentOrder: Order | null;
  shopOrders: Order[];
  statusValues: OrderItemStatus[];
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  userOrders: [],
  currentOrder: null,
  shopOrders: [],
  statusValues: [],
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    clearCurrentOrder(state) {
      state.currentOrder = null;
    },
    clearOrderError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        state.currentOrder = action.payload;
        state.userOrders = [action.payload, ...state.userOrders];
        state.loading = false;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create order";
      })
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
        state.userOrders = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load orders";
      })
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrderById.fulfilled, (state, action: PayloadAction<Order>) => {
        state.currentOrder = action.payload;
        state.loading = false;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Order not found";
      })
      .addCase(fetchShopOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
        state.shopOrders = action.payload;
      })
      .addCase(fetchStatusValues.fulfilled, (state, action: PayloadAction<OrderItemStatus[]>) => {
        state.statusValues = action.payload;
      })
      .addCase(updateOrderItemStatus.fulfilled, (state, action: PayloadAction<UpdateStatusPayload>) => {
        const { orderId, cartItemId, status } = action.payload;
        const updateOrder = (order: Order) => {
          const item = order.products.find((p) => p._id === cartItemId);
          if (item) item.status = status;
        };
        const userOrder = state.userOrders.find((o) => o._id === orderId);
        if (userOrder) updateOrder(userOrder);
        if (state.currentOrder?._id === orderId) updateOrder(state.currentOrder);
        const shopOrder = state.shopOrders.find((o) => o._id === orderId);
        if (shopOrder) updateOrder(shopOrder);
      })
      .addCase(cancelOrderItem.fulfilled, (state, action: PayloadAction<UpdateStatusPayload>) => {
        const { orderId, cartItemId, status } = action.payload;
        const updateOrder = (order: Order) => {
          const item = order.products.find((p) => p._id === cartItemId);
          if (item) item.status = status;
        };
        const userOrder = state.userOrders.find((o) => o._id === orderId);
        if (userOrder) updateOrder(userOrder);
        if (state.currentOrder?._id === orderId) updateOrder(state.currentOrder);
        const shopOrder = state.shopOrders.find((o) => o._id === orderId);
        if (shopOrder) updateOrder(shopOrder);
      })
      .addCase(processChargeForItem.fulfilled, (state, action: PayloadAction<UpdateStatusPayload>) => {
        const { orderId, cartItemId, status } = action.payload;
        const updateOrder = (order: Order) => {
          const item = order.products.find((p) => p._id === cartItemId);
          if (item) item.status = status;
        };
        const userOrder = state.userOrders.find((o) => o._id === orderId);
        if (userOrder) updateOrder(userOrder);
        if (state.currentOrder?._id === orderId) updateOrder(state.currentOrder);
        const shopOrder = state.shopOrders.find((o) => o._id === orderId);
        if (shopOrder) updateOrder(shopOrder);
      });
  },
});

export const { clearCurrentOrder, clearOrderError } = orderSlice.actions;
export default orderSlice.reducer;

export const selectUserOrders = (state: RootState) => state.order.userOrders;
export const selectCurrentOrder = (state: RootState) => state.order.currentOrder;
export const selectShopOrders = (state: RootState) => state.order.shopOrders;
export const selectStatusValues = (state: RootState) => state.order.statusValues;
export const selectOrderLoading = (state: RootState) => state.order.loading;
export const selectOrderError = (state: RootState) => state.order.error;
export const selectOrderCreationLoading = (state: RootState) => state.order.loading;
