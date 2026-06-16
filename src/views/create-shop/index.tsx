// src/views/create-shop/index.tsx

import { ShopForm, type ShopFormData } from "@/features/shop-form/ui/shop-form";
import { createShop, selectMyShops, selectShopLoading, useAppDispatch, useAppSelector } from "@/store";
import type { CreateShopDto } from "@/types";
import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const CreateShopPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isLoading = useAppSelector(selectShopLoading);
  const myShops = useAppSelector(selectMyShops);

  useEffect(() => {
    document.title = "Создание магазина | Маркетплейс";
    return () => {
      document.title = "Маркетплейс";
    };
  }, []);

  const handleSubmit = useCallback(
    async (formData: ShopFormData) => {
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

      const nameExists = myShops.some((shop) => shop.name.toLowerCase() === trimmedName.toLowerCase());
      if (nameExists) {
        toast.error("Магазин с таким названием уже существует. Пожалуйста, выберите другое название.");
        return;
      }

      const payload: CreateShopDto = {
        name: trimmedName,
        description: trimmedDescription,
        image: formData.image ?? undefined, // null => undefined
      };

      try {
        await dispatch(createShop(payload)).unwrap();
        toast.success("Магазин успешно создан");
        navigate("/seller/shops");
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Не удалось создать магазин";
        toast.error(errorMessage);
      }
    },
    [dispatch, myShops, navigate],
  );

  return (
    <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-2xl">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Создание нового магазина</h1>
      <ShopForm onSubmit={handleSubmit} submitLabel="Создать магазин" isLoading={isLoading} />
    </main>
  );
};

export default CreateShopPage;
