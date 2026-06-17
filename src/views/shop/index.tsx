// src/views/shop/index.tsx

import { ProductCard } from "@/entities/product";
import { Spinner } from "@/shared/ui";
import { IfOwner } from "@/shared/ui/if-owner";
import {
  clearCurrentShop,
  fetchShopById,
  fetchShopProducts,
  selectCurrentShop,
  selectProductLoading,
  selectShopError,
  selectShopLoading,
  selectShopProducts,
  useAppDispatch,
  useAppSelector,
} from "@/store";
import type { ShopId } from "@/types";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";

type ShopRouteParams = {
  shopId: string;
};

export const ShopPage: React.FC = () => {
  const { shopId } = useParams<ShopRouteParams>();
  const dispatch = useAppDispatch();
  const shop = useAppSelector(selectCurrentShop);
  const shopLoading = useAppSelector(selectShopLoading);
  const shopError = useAppSelector(selectShopError);
  const products = useAppSelector(selectShopProducts);
  const productsLoading = useAppSelector(selectProductLoading);

  const brandedShopId = shopId as ShopId;

  useEffect(() => {
    if (shop) {
      document.title = `${shop.name} | Магазин | Маркетплейс`;
    } else if (brandedShopId) {
      document.title = `Магазин | Маркетплейс`;
    } else {
      document.title = "Маркетплейс";
    }
    return () => {
      document.title = "Маркетплейс";
    };
  }, [shop, brandedShopId]);

  useEffect(() => {
    if (brandedShopId) {
      dispatch(fetchShopById(brandedShopId));
      dispatch(fetchShopProducts(brandedShopId));
    }
    return () => {
      dispatch(clearCurrentShop());
    };
  }, [dispatch, brandedShopId]);

  if (shopError && !shopLoading) {
    return (
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-md text-center" role="alert">
          Магазин не найден
        </div>
      </main>
    );
  }

  if (shopLoading || !shop) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]" role="status" aria-live="polite">
        <Spinner aria-label="Загрузка магазина" />
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Информация о магазине */}
      <section className="flex flex-col md:flex-row gap-6 md:gap-8 mb-8" aria-labelledby="shop-info-heading">
        <h1 id="shop-info-heading" className="sr-only">
          Информация о магазине
        </h1>

        <img
          src={shop.image}
          alt={`Логотип магазина ${shop.name}`}
          className="w-32 sm:w-40 md:w-48 h-32 sm:h-40 md:h-48 object-cover rounded-lg shadow-md mx-auto md:mx-0"
          onError={(e) => {
            (e.target as HTMLImageElement).src = import.meta.env.BASE_URL + "images/default-shop.jpg";
          }}
        />

        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold break-words">{shop.name}</h2>
              <p className="text-gray-600 dark:text-gray-300 mt-2">{shop.description}</p>
              <p className="text-sm text-gray-500 mt-2">Владелец: {shop.owner.name}</p>
            </div>
            <IfOwner ownerId={shop.owner._id}>
              <Link
                to={`/seller/shop/${shop._id}/edit`}
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Редактировать магазин
              </Link>
            </IfOwner>
          </div>
        </div>
      </section>

      {/* Список товаров магазина */}
      <section aria-labelledby="products-heading">
        <h2 id="products-heading" className="text-xl sm:text-2xl font-bold mb-6">
          Товары магазина
        </h2>

        {productsLoading ? (
          <div className="flex justify-center py-8" role="status" aria-live="polite">
            <Spinner aria-label="Загрузка товаров" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-600 dark:text-gray-300">В этом магазине пока нет товаров.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default ShopPage;
