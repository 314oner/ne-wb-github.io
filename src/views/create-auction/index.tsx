// src/views/create-auction/index.tsx

import { AuctionForm, type AuctionFormData } from "@/features/auction-form/ui/auction-form";
import { createAuction, selectAuctionLoading, useAppDispatch, useAppSelector } from "@/store";
import type { CreateAuctionDto } from "@/types";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const CreateAuctionPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const loading = useAppSelector(selectAuctionLoading);

  useEffect(() => {
    document.title = "Создание аукциона | Маркетплейс";
    return () => {
      document.title = "Маркетплейс";
    };
  }, []);

  const handleSubmit = async (data: AuctionFormData) => {
    if (!data.itemName?.trim() || !data.description?.trim() || !data.startingBid || !data.bidStart || !data.bidEnd) {
      toast.error("Заполните все обязательные поля");
      return;
    }

    const auctionData: CreateAuctionDto = {
      itemName: data.itemName,
      description: data.description,
      startingBid: data.startingBid,
      bidStart: data.bidStart,
      bidEnd: data.bidEnd,
      image: data.image ?? undefined,
    };

    try {
      await dispatch(createAuction(auctionData)).unwrap();
      toast.success("Аукцион успешно создан");
      navigate("/myauctions");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Не удалось создать аукцион";
      toast.error(errorMessage);
    }
  };

  return (
    <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-2xl">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Создание нового аукциона</h1>
      <AuctionForm onSubmit={handleSubmit} submitLabel="Создать аукцион" isLoading={loading} />
    </main>
  );
};

export default CreateAuctionPage;
