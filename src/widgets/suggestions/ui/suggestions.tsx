// src/widgets/suggestions/ui/suggestions.tsx

import MemoizedProductCard from "@/entities/product/ui/product-card";
import { Spinner } from "@/shared/ui";
import { fetchLatestProducts, selectLatestProducts, selectProductLoading, useAppDispatch, useAppSelector } from "@/store";
import { Product } from "@/types";
import { useEffect, useState } from "react";

const ITEMS_PER_PAGE = 5;

export const Suggestions: React.FC<{ title: string; products?: Product[] }> = ({ title, products: externalProducts }) => {
  const dispatch = useAppDispatch();
  const storeProducts = useAppSelector(selectLatestProducts);
  const loading = useAppSelector(selectProductLoading);

  const isExternal = Boolean(externalProducts);
  const displayProducts = externalProducts || storeProducts;

  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [prevProducts, setPrevProducts] = useState(displayProducts);

  if (displayProducts !== prevProducts) {
    setPrevProducts(displayProducts);
    setVisibleCount(ITEMS_PER_PAGE);
  }

  useEffect(() => {
    if (!isExternal && storeProducts.length === 0) {
      dispatch(fetchLatestProducts());
    }
  }, [dispatch, isExternal, storeProducts.length]);

  const visibleProducts = displayProducts.slice(0, visibleCount);
  const hasMore = visibleCount < displayProducts.length;

  if (loading && !isExternal) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow p-4">
        <h3 className="text-xl font-bold mb-4 text-wcag-green">{title}</h3>
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow p-4">
      <h3 className="text-xl font-bold mb-4 text-wcag-green">{title}</h3>
      <div className="space-y-4">
        {visibleProducts.map((product) => (
          <MemoizedProductCard key={product._id} product={product} horizontal />
        ))}
      </div>
      {hasMore && (
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Показать ещё ({displayProducts.length - visibleCount} осталось)
          </button>
        </div>
      )}
    </div>
  );
};

export default Suggestions;
