// src/widgets/shop-orders-list/ui/shop-orders-list.tsx

import { Select } from "@/shared/ui";
import { cancelOrderItem, processChargeForItem, selectStatusValues, updateOrderItemStatus, useAppDispatch, useAppSelector } from "@/store";
import type { Order, OrderId, OrderItemId, OrderItemStatus, ShopId } from "@/types";
import { useState } from "react";
import { toast } from "react-toastify";

interface ShopOrdersListProps {
  orders: Order[];
  shopId: ShopId;
}

export const ShopOrdersList: React.FC<ShopOrdersListProps> = ({ orders, shopId }) => {
  const dispatch = useAppDispatch();
  const statusValues = useAppSelector(selectStatusValues);
  const [expandedOrderId, setExpandedOrderId] = useState<OrderId | null>(null);

  const handleStatusChange = (
    orderId: OrderId,
    cartItemId: OrderItemId,
    currentStatus: string,
    newStatus: OrderItemStatus,
    quantity?: number,
    amount?: number,
  ) => {
    if (newStatus === "Cancelled") {
      dispatch(
        cancelOrderItem({
          orderId,
          cartItemId,
          status: "Cancelled",
          shopId,
          quantity,
        }),
      )
        .unwrap()
        .then(() => toast.success("Товар отменён"));
    } else if (newStatus === "Processing" && currentStatus !== "Processing") {
      dispatch(
        processChargeForItem({
          orderId,
          cartItemId,
          status: "Processing",
          shopId,
          amount,
        }),
      )
        .unwrap()
        .then(() => toast.success("Оплата проведена"));
    } else {
      dispatch(
        updateOrderItemStatus({
          orderId,
          cartItemId,
          status: newStatus,
          shopId,
        }),
      )
        .unwrap()
        .then(() => toast.success("Статус обновлён"));
    }
  };

  if (orders.length === 0) {
    return <p className="text-gray-500">Нет заказов для этого магазина.</p>;
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const shopItems = order.products.filter((item) => item.shop._id === shopId);
        if (shopItems.length === 0) return null;

        const isExpanded = expandedOrderId === order._id;
        const contentId = `order-content-${order._id}`;
        const headingId = `order-heading-${order._id}`;

        return (
          <div key={order._id} className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <button
              type="button"
              onClick={() => setExpandedOrderId(isExpanded ? null : order._id)}
              className="w-full text-left p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700"
              aria-expanded={isExpanded}
              aria-controls={contentId}
            >
              <div id={headingId}>
                <span className="font-mono text-sm">Заказ №{order._id}</span>
                <div className="text-xs text-gray-500">{new Date(order.created).toDateString()}</div>
              </div>
              <span aria-hidden="true">{isExpanded ? "▲" : "▼"}</span>
            </button>

            {isExpanded && (
              <section id={contentId} aria-labelledby={headingId} className="border-t p-4 space-y-4">
                {shopItems.map((item) => (
                  <div key={item._id} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center p-2 border-b last:border-0">
                    <img src={item.product.image} alt={item.product.name} className="w-16 h-16 object-cover rounded" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{item.product.name}</div>
                      <div className="text-sm">Кол-во: {item.quantity}</div>
                    </div>
                    <div className="w-full sm:w-48">
                      <Select
                        value={item.status}
                        options={statusValues.map((s) => ({
                          value: s,
                          label: s,
                        }))}
                        onChange={(e) => {
                          const newStatus = e.target.value as OrderItemStatus;
                          if (newStatus !== item.status) {
                            handleStatusChange(order._id, item._id, item.status, newStatus, item.quantity, item.quantity * item.product.price);
                          }
                        }}
                        aria-label={`Статус товара ${item.product.name}`}
                      />
                    </div>
                  </div>
                ))}
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                  <div className="font-semibold">Покупатель: {order.customer_name}</div>
                  <div className="text-sm">{order.customer_email}</div>
                  <div className="text-sm mt-1">
                    {order.delivery_address.street}, {order.delivery_address.city}, {order.delivery_address.country}
                  </div>
                </div>
              </section>
            )}
          </div>
        );
      })}
    </div>
  );
};
