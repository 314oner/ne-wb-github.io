// src/views/my-orders/index.tsx

import { Spinner } from "@/shared/ui";
import { fetchUserOrders, selectCurrentUser, selectOrderLoading, selectUserOrders, useAppDispatch, useAppSelector } from "@/store";
import { useEffect } from "react";
import { Link } from "react-router-dom";

export const MyOrdersPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const orders = useAppSelector(selectUserOrders);
  const loading = useAppSelector(selectOrderLoading);

  useEffect(() => {
    document.title = "Мои заказы | Маркетплейс";
    return () => {
      document.title = "Маркетплейс";
    };
  }, []);

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchUserOrders(user._id));
    }
  }, [dispatch, user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]" role="status" aria-live="polite">
        <Spinner aria-label="Загрузка ваших заказов" />
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-3xl">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Мои заказы</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-600 dark:text-gray-300">У вас пока нет заказов.</p>
          <Link to="/" className="inline-block mt-4 text-blue-600 dark:text-blue-400 hover:underline">
            Вернуться к покупкам
          </Link>
        </div>
      ) : (
        <section aria-label="Список ваших заказов">
          <div className="space-y-3">
            {orders.map((order) => (
              <Link
                key={order._id}
                to={`/order/${order._id}`}
                className="block p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={`Заказ от ${new Date(order.created).toLocaleDateString()}, сумма ${order.total} рублей`}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <span className="font-mono text-sm">Заказ #{order._id}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(order.created).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {order.products.length} товар(ов) · Сумма: {order.total.toLocaleString()} ₽
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
};

export default MyOrdersPage;
