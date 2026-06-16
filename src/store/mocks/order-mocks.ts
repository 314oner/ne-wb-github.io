import type { Order, OrderId, OrderItemId, OrderItemStatus, ProductId, ShopId, UserId } from "@/types";

export const mockOrders: Order[] = [
  {
    _id: "ord_1" as OrderId,
    products: [
      {
        _id: "item_1" as OrderItemId,
        product: {
          _id: "p1" as ProductId,
          name: "pokemon1",
          price: 120,
          image: "/images/avatars/1.svg",
          shop: { _id: "s1" as ShopId, name: "Antique Store" },
        },
        quantity: 1,
        shop: { _id: "s1" as ShopId, name: "Antique Store" },
        status: "Delivered" as OrderItemStatus,
      },
    ],
    customer_name: "John Doe",
    customer_email: "john@example.com",
    delivery_address: {
      street: "123 Main St",
      city: "MSK",
      state: "Pushkina Street",
      zipcode: "10001",
      country: "RU",
    },
    total: 120,
    created: "2025-05-15T10:00:00Z",
    user: "u1" as UserId,
  },
  {
    _id: "ord_2" as OrderId,
    products: [
      {
        _id: "item_2" as OrderItemId,
        product: {
          _id: "p2" as ProductId,
          name: "pokemon2",
          price: 89,
          image: "/images/avatars/2.svg",
          shop: { _id: "s2" as ShopId, name: "Artisan Shop" },
        },
        quantity: 2,
        shop: { _id: "s2" as ShopId, name: "Artisan Shop" },
        status: "Processing" as OrderItemStatus,
      },
    ],
    customer_name: "Mister Smith",
    customer_email: "Mister@example.com",
    delivery_address: {
      street: "456 Oak Ave",
      city: "MSK",
      state: "Kolotushkin Street",
      zipcode: "90001",
      country: "RU",
    },
    total: 178,
    created: "2025-05-20T14:30:00Z",
    user: "u2" as UserId,
  },
];

export const mockStatusValues: OrderItemStatus[] = ["Not processed", "Processing", "Shipped", "Delivered", "Cancelled"];
