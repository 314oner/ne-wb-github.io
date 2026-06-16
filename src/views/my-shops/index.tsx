// src/views/my-shops/index.tsx

import { ShopCard } from "@/entities/shop";
import { Spinner } from "@/shared/ui";
import { fetchMyShops, selectCurrentUser, selectMyShops, selectShopLoading, useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

export const MyShopsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const shops = useAppSelector(selectMyShops);
  const loading = useAppSelector(selectShopLoading);
  const user = useAppSelector(selectCurrentUser);
  const fetchedRef = useRef(false);

  useEffect(() => {
    document.title = "Мои магазины | Маркетплейс";
    return () => {
      document.title = "Маркетплейс";
    };
  }, []);

  useEffect(() => {
    if (user?._id && !fetchedRef.current && shops.length === 0 && !loading) {
      dispatch(fetchMyShops(user._id));
      fetchedRef.current = true;
    }
  }, [dispatch, user?._id, shops.length, loading]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]" role="status" aria-live="polite">
        <Spinner aria-label="Загрузка ваших магазинов" />
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Мои магазины</h1>
        <Link
          to="/seller/shop/new"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          + Создать магазин
        </Link>
      </div>

      {shops.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-600 dark:text-gray-300 mb-4">У вас пока нет созданных магазинов.</p>
          <Link to="/seller/shop/new" className="inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition">
            Создать первый магазин
          </Link>
        </div>
      ) : (
        <section aria-label="Список ваших магазинов">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shops.map((shop) => (
              <ShopCard key={shop._id} shop={shop} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
};

export default MyShopsPage;
