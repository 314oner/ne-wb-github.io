// src/views/product/index.tsx

import { Spinner } from "@/shared/ui";
import {
  clearCurrentProduct,
  fetchProductById,
  fetchRelatedProducts,
  selectCurrentProduct,
  selectProductLoading,
  selectRelatedProducts,
  useAppDispatch,
  useAppSelector,
} from "@/store";
import type { ProductId } from "@/types";
import { ProductDetails } from "@/widgets/product-details/ui/product-details";
import { Suggestions } from "@/widgets/suggestions/ui/suggestions";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

type ProductRouteParams = {
  productId: string;
};

export const ProductPage: React.FC = () => {
  const { productId } = useParams<ProductRouteParams>();
  const dispatch = useAppDispatch();
  const product = useAppSelector(selectCurrentProduct);
  const related = useAppSelector(selectRelatedProducts);
  const loading = useAppSelector(selectProductLoading);

  const brandedProductId = productId as ProductId;

  useEffect(() => {
    if (product) {
      document.title = `${product.name} | Маркетплейс`;
    } else if (productId) {
      document.title = `Товар ${productId} | Маркетплейс`;
    } else {
      document.title = "Товар | Маркетплейс";
    }
    return () => {
      document.title = "Маркетплейс";
    };
  }, [product, productId]);

  useEffect(() => {
    if (brandedProductId) {
      dispatch(fetchProductById(brandedProductId));
      dispatch(fetchRelatedProducts(brandedProductId));
    }
    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [dispatch, brandedProductId]);

  if (loading || !product) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]" role="status" aria-live="polite">
        <Spinner aria-label="Загрузка товара" />
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Основная информация о товаре */}
        <section className="lg:col-span-2" aria-labelledby="product-details-heading">
          <h1 id="product-details-heading" className="sr-only">
            Детали товара
          </h1>
          <ProductDetails product={product} />
        </section>

        {/* Похожие товары */}
        {related.length > 0 && (
          <section className="lg:col-span-1" aria-labelledby="related-heading">
            <Suggestions title="Похожие товары" products={related} />
          </section>
        )}
      </div>
    </main>
  );
};

export default ProductPage;
