// src/views/edit-shop/index.tsx

import { ShopForm, type ShopFormData } from "@/features/shop-form/ui/shop-form";
import { Spinner } from "@/shared/ui";
import { IfOwner } from "@/shared/ui/if-owner";
import {
  clearCurrentShop,
  clearShopError,
  fetchShopById,
  selectCurrentShop,
  selectShopError,
  selectShopLoading,
  updateShop,
  useAppDispatch,
  useAppSelector,
} from "@/store";
import type { ShopId, UpdateShopDto } from "@/types";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

type EditShopRouteParams = {
  shopId: string;
};

export const EditShopPage: React.FC = () => {
  const { shopId } = useParams<EditShopRouteParams>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const shop = useAppSelector(selectCurrentShop);
  const loading = useAppSelector(selectShopLoading);
  const error = useAppSelector(selectShopError);

  const brandedShopId = shopId as ShopId;

  useEffect(() => {
    document.title = "Редактирование магазина | Маркетплейс";
    return () => {
      document.title = "Маркетплейс";
    };
  }, []);

  useEffect(() => {
    if (!brandedShopId) return;
    dispatch(clearShopError());
    dispatch(fetchShopById(brandedShopId));
    return () => {
      dispatch(clearCurrentShop());
    };
  }, [dispatch, brandedShopId]);

  useEffect(() => {
    if (!loading && error) {
      toast.error(error);
      navigate("/shops/all", { replace: true });
    }
  }, [error, loading, navigate]);

  const handleSubmit = async (formData: ShopFormData) => {
    if (!brandedShopId) {
      toast.error("Идентификатор магазина не указан");
      return;
    }

    const trimmedName = formData.name.trim();
    const trimmedDescription = formData.description.trim();

    if (!trimmedName) {
      toast.error("Название магазина не может быть пустым");
      return;
    }
    if (!trimmedDescription) {
      toast.error("Описание магазина не может быть пустым");
      return;
    }

    const payload: UpdateShopDto = {
      name: trimmedName,
      description: trimmedDescription,
      image: formData.image ?? undefined,
    };

    try {
      await dispatch(updateShop({ shopId: brandedShopId, formData: payload })).unwrap();
      toast.success("Магазин успешно обновлён");
      navigate(`/shops/${brandedShopId}`);
    } catch (err: unknown) {
      const backendError = err as { message?: string } | undefined;
      const errorMessage = backendError?.message || (err instanceof Error ? err.message : "Не удалось обновить магазин");
      toast.error(errorMessage);
    }
  };

  if (loading || !shop) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]" role="status" aria-live="polite">
        <Spinner aria-label="Загрузка магазина" />
      </div>
    );
  }

  return (
    <IfOwner ownerId={shop.owner._id}>
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-2xl">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">Редактирование магазина</h1>
        <ShopForm
          initialData={{ name: shop.name, description: shop.description }}
          onSubmit={handleSubmit}
          submitLabel="Обновить магазин"
          isLoading={loading}
        />
      </main>
    </IfOwner>
  );
};

export default EditShopPage;
