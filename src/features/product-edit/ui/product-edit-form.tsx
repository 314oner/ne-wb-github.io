// src/features/product-edit/ui/index.tsx

import { ProductForm, type ProductFormData } from "@/features/product-form/ui/product-form";
import { IfOwner, Spinner } from "@/shared/ui";
import {
  clearCurrentProduct,
  fetchProductById,
  fetchShopById,
  selectCurrentProduct,
  selectProductLoading,
  selectShopById,
  selectShopError,
  selectShopLoading,
  updateProduct,
  useAppDispatch,
  useAppSelector,
} from "@/store";
import type { ProductId, ShopId, UpdateProductDto } from "@/types";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

type EditProductRouteParams = {
  productId: string;
  shopId: string;
};

export const ProductEditForm: React.FC = () => {
  const { productId, shopId } = useParams<EditProductRouteParams>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const brandedProductId = productId as ProductId;
  const brandedShopId = shopId as ShopId;

  const product = useAppSelector(selectCurrentProduct);
  const isLoadingProduct = useAppSelector(selectProductLoading);
  const shop = useAppSelector((state) => (brandedShopId ? selectShopById(brandedShopId)(state) : undefined));
  const shopLoading = useAppSelector(selectShopLoading);
  const shopError = useAppSelector(selectShopError);

  useEffect(() => {
    if (product) {
      document.title = `Редактирование товара: ${product.name} | Маркетплейс`;
    } else if (brandedProductId) {
      document.title = `Редактирование товара | Маркетплейс`;
    } else {
      document.title = "Маркетплейс";
    }
    return () => {
      document.title = "Маркетплейс";
    };
  }, [product, brandedProductId]);

  useEffect(() => {
    if (brandedProductId) {
      dispatch(fetchProductById(brandedProductId));
    }
    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [dispatch, brandedProductId]);

  useEffect(() => {
    if (brandedShopId) {
      dispatch(fetchShopById(brandedShopId));
    }
  }, [dispatch, brandedShopId]);

  useEffect(() => {
    if (shopError) {
      navigate("/shops/all", { replace: true });
    }
  }, [shopError, navigate]);

  const handleSubmit = async (formData: ProductFormData) => {
    if (!brandedProductId) {
      toast.error("Идентификатор товара не указан");
      return;
    }

    if (!formData.name?.trim()) {
      toast.error("Название товара обязательно");
      return;
    }
    if (formData.price === undefined || formData.price <= 0) {
      toast.error("Цена должна быть больше 0");
      return;
    }
    if (formData.quantity === undefined || formData.quantity < 0) {
      toast.error("Количество должно быть неотрицательным");
      return;
    }

    const productData: UpdateProductDto = {
      name: formData.name,
      description: formData.description,
      category: formData.category,
      quantity: formData.quantity,
      price: formData.price,
      image: formData.image ?? undefined,
    };

    try {
      await dispatch(
        updateProduct({
          productId: brandedProductId,
          productData,
        }),
      ).unwrap();
      toast.success("Товар успешно обновлён");
      navigate(`/seller/shop/${brandedShopId}/products`);
    } catch (err: unknown) {
      const backendError = err as { message?: string } | undefined;
      const errorMessage = backendError?.message || (err instanceof Error ? err.message : "Не удалось обновить товар");
      toast.error(errorMessage);
    }
  };

  if (isLoadingProduct || !product || shopLoading || !shop) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]" role="status" aria-live="polite">
        <Spinner aria-label="Загрузка данных товара" />
      </div>
    );
  }

  return (
    <IfOwner ownerId={shop.owner._id}>
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-2xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
          <h1 className="text-xl sm:text-2xl font-bold mb-6">Редактирование товара</h1>
          <ProductForm
            initialValues={{
              name: product.name,
              description: product.description || "",
              category: product.category || "",
              quantity: product.quantity,
              price: product.price,
            }}
            onSubmit={handleSubmit}
            submitLabel="Обновить товар"
            isLoading={isLoadingProduct}
          />
        </div>
      </main>
    </IfOwner>
  );
};

export default ProductEditForm;
