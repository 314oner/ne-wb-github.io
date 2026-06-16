import type { CartItem } from "./cart";
import type { OrderId, OrderItemId, ProductId, ShopId, UserId } from "./common";

export type OrderItemStatus = "Not processed" | "Processing" | "Shipped" | "Delivered" | "Cancelled";

export interface OrderItem {
  _id: OrderItemId;
  product: {
    _id: ProductId;
    name: string;
    price: number;
    image: string;
    shop: {
      _id: ShopId;
      name: string;
    };
  };
  quantity: number;
  shop: {
    _id: ShopId;
    name: string;
  };
  status: OrderItemStatus;
}

export interface Order {
  _id: OrderId;
  products: OrderItem[];
  customer_name: string;
  customer_email: string;
  delivery_address: DeliveryAddress;
  total: number;
  created: string;
  user: UserId;
}

export interface DeliveryAddress {
  street: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
}

export interface CreateOrderPayload {
  order: {
    products: CartItem[];
    customer_name: string;
    customer_email: string;
    delivery_address: DeliveryAddress;
  };
  tokenId: string;
}

export interface UpdateStatusPayload {
  orderId: OrderId;
  cartItemId: OrderItemId;
  status: OrderItemStatus;
  shopId: ShopId;
  quantity?: number;
  amount?: number;
}
