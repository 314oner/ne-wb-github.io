// src/views/shops/index.tsx

import { ShopCard } from "@/entities/shop";
import { Spinner } from "@/shared/ui";
import { fetchAllShops, selectAllShops, selectShopLoading, useAppDispatch, useAppSelector } from "@/store";
import { useEffect } from "react";

export const ShopsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const shops = useAppSelector(selectAllShops);
  const loading = useAppSelector(selectShopLoading);

  useEffect(() => {
    document.title = "Все магазины | Маркетплейс";
    return () => {
      document.title = "Маркетплейс";
    };
  }, []);

  useEffect(() => {
    dispatch(fetchAllShops());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]" role="status" aria-live="polite">
        <Spinner aria-label="Загрузка магазинов" />
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Все магазины</h1>

      {shops.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-600 dark:text-gray-300">На данный момент нет зарегистрированных магазинов.</p>
        </div>
      ) : (
        <section aria-label="Список магазинов">
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

export default ShopsPage;
