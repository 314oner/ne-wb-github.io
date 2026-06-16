// src/views/order/index.tsx

import { Spinner } from "@/shared/ui";
import { clearCurrentOrder, fetchOrderById, selectCurrentOrder, selectOrderError, selectOrderLoading, useAppDispatch, useAppSelector } from "@/store";
import type { OrderId } from "@/types";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

type OrderRouteParams = {
  orderId: string;
};

export const OrderPage: React.FC = () => {
  const { orderId } = useParams<OrderRouteParams>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const order = useAppSelector(selectCurrentOrder);
  const loading = useAppSelector(selectOrderLoading);
  const error = useAppSelector(selectOrderError);

  const brandedOrderId = orderId as OrderId;

  useEffect(() => {
    if (!orderId) {
      navigate("/", { replace: true });
      return;
    }
    document.title = `Заказ ${orderId} | Маркетплейс`;
    return () => {
      document.title = "Маркетплейс";
    };
  }, [orderId, navigate]);

  useEffect(() => {
    if (brandedOrderId) {
      dispatch(fetchOrderById(brandedOrderId));
    }
    return () => {
      dispatch(clearCurrentOrder());
    };
  }, [dispatch, brandedOrderId]);

  useEffect(() => {
    if (error) {
      navigate("/", { replace: true });
    }
  }, [error, navigate]);

  if (loading || !order) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]" role="status" aria-live="polite">
        <Spinner aria-label="Загрузка информации о заказе" />
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Детали заказа #{order._id}</h1>
    </main>
  );
};

export default OrderPage;
