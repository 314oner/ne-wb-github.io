import type { CreateOrderPayload, Order, OrderId, OrderItemId, OrderItemStatus, ShopId, UpdateStatusPayload, UserId } from "@/types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../index";
import { mockOrders, mockStatusValues } from "../mocks/order-mocks";

export const createOrder = createAsyncThunk<Order, CreateOrderPayload, { state: RootState }>("order/create", async (payload, { getState }) => {
  await new Promise((resolve) => setTimeout(resolve, 1200));
  const { order } = payload;
  const total = order.products.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const mockOrder: Order = {
    _id: `ord_${Date.now()}_${Math.random().toString(36).substring(2, 10)}` as OrderId,
    products: order.products.map((p) => ({
      _id: `item_${Date.now()}_${p.product._id}` as OrderItemId,
      product: p.product,
      quantity: p.quantity,
      shop: p.shop as unknown as any,
      status: "Not processed" as OrderItemStatus,
    })),
    customer_name: order.customer_name,
    customer_email: order.customer_email,
    delivery_address: order.delivery_address,
    total,
    created: new Date().toISOString(),
    user: (getState() as RootState).user.current?._id || ("anonymous" as UserId),
  };
  return mockOrder;
});

export const fetchUserOrders = createAsyncThunk<Order[], UserId, { state: RootState }>("order/fetchUserOrders", async (userId) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockOrders.filter((o) => o.user === userId);
});

export const fetchOrderById = createAsyncThunk<Order, OrderId, { state: RootState }>("order/fetchOrderById", async (orderId) => {
  await new Promise((resolve) => setTimeout(resolve, 400));
  const order = mockOrders.find((o) => o._id === orderId);
  if (!order) throw new Error("Order not found");
  return order;
});

export const fetchShopOrders = createAsyncThunk<Order[], ShopId, { state: RootState }>("order/fetchShopOrders", async (shopId) => {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return mockOrders.filter((order) => order.products.some((item) => item.shop._id === shopId));
});

export const fetchStatusValues = createAsyncThunk<OrderItemStatus[], void, { state: RootState }>("order/fetchStatusValues", async () => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockStatusValues as OrderItemStatus[];
});

export const updateOrderItemStatus = createAsyncThunk<UpdateStatusPayload, UpdateStatusPayload, { state: RootState }>(
  "order/updateOrderItemStatus",
  async (payload) => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return payload;
  },
);

export const cancelOrderItem = createAsyncThunk<UpdateStatusPayload, UpdateStatusPayload, { state: RootState }>(
  "order/cancelOrderItem",
  async (payload) => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return { ...payload, status: "Cancelled" as OrderItemStatus };
  },
);

export const processChargeForItem = createAsyncThunk<UpdateStatusPayload, UpdateStatusPayload, { state: RootState }>(
  "order/processCharge",
  async (payload) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { ...payload, status: "Processing" as OrderItemStatus };
  },
);
