// src/widgets/suggestions/ui/suggestions.tsx

import { ProductCard } from "@/entities/product";
import { Spinner } from "@/shared/ui";
import { fetchLatestProducts, selectLatestProducts, selectProductLoading, useAppDispatch, useAppSelector } from "@/store";
import { Product } from "@/types";
import { useEffect } from "react";

interface SuggestionsProps {
  title: string;
  products?: Product[];
}

export const Suggestions: React.FC<SuggestionsProps> = ({ title, products: externalProducts }) => {
  const dispatch = useAppDispatch();

  const storeProducts = useAppSelector(selectLatestProducts);
  const loading = useAppSelector(selectProductLoading);

  const isExternal = Boolean(externalProducts);
  const displayProducts = externalProducts || storeProducts;

  useEffect(() => {
    // позитиффф
    if (!isExternal && storeProducts.length === 0) {
      dispatch(fetchLatestProducts());
    }
  }, [dispatch, isExternal, storeProducts.length]);

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow p-4">
      <h3 className="text-xl font-bold mb-4 text-wcag-green">{title}</h3>
      {loading && !isExternal ? (
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      ) : (
        <div className="space-y-4">
          {displayProducts.map((product) => (
            <ProductCard key={product._id} product={product} horizontal />
          ))}
        </div>
      )}
    </div>
  );
};
