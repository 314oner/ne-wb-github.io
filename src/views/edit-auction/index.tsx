// src/views/edit-auction/index.tsx

import { AuctionForm, type AuctionFormData } from "@/features/auction-form/ui/auction-form";
import { IfOwner, Spinner } from "@/shared/ui";
import {
  clearCurrentAuction,
  fetchAuctionById,
  selectAuctionError,
  selectAuctionLoading,
  selectCurrentAuction,
  updateAuction,
  useAppDispatch,
  useAppSelector,
} from "@/store";
import type { AuctionId, UpdateAuctionDto } from "@/types";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

type EditAuctionRouteParams = {
  auctionId: string;
};

export const EditAuctionPage: React.FC = () => {
  const { auctionId } = useParams<EditAuctionRouteParams>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const auction = useAppSelector(selectCurrentAuction);
  const loading = useAppSelector(selectAuctionLoading);
  const error = useAppSelector(selectAuctionError);

  const brandedAuctionId = auctionId as AuctionId;

  useEffect(() => {
    document.title = "Редактирование аукциона | Маркетплейс";
    return () => {
      document.title = "Маркетплейс";
    };
  }, []);

  useEffect(() => {
    if (brandedAuctionId) {
      dispatch(fetchAuctionById(brandedAuctionId));
    }
    return () => {
      dispatch(clearCurrentAuction());
    };
  }, [dispatch, brandedAuctionId]);

  useEffect(() => {
    if (error) {
      navigate("/auctions/all", { replace: true });
    }
  }, [error, navigate]);

  const handleSubmit = async (data: AuctionFormData) => {
    if (!data.itemName?.trim() || !data.description?.trim() || !data.startingBid || !data.bidStart || !data.bidEnd) {
      toast.error("Заполните все обязательные поля");
      return;
    }

    if (!brandedAuctionId) {
      toast.error("Идентификатор аукциона не указан");
      return;
    }

    const formData: UpdateAuctionDto = {
      itemName: data.itemName,
      description: data.description,
      startingBid: data.startingBid,
      bidStart: data.bidStart,
      bidEnd: data.bidEnd,
      image: data.image ?? undefined,
    };

    try {
      await dispatch(updateAuction({ auctionId: brandedAuctionId, formData })).unwrap();
      toast.success("Аукцион успешно обновлён");
      navigate(`/auction/${brandedAuctionId}`);
    } catch (err: unknown) {
      const backendError = err as { message?: string } | undefined;
      const errorMessage = backendError?.message || (err instanceof Error ? err.message : "Не удалось обновить аукцион");
      toast.error(errorMessage);
    }
  };

  if (loading || !auction) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]" role="status" aria-live="polite">
        <Spinner aria-label="Загрузка аукциона" />
      </div>
    );
  }

  const initialData: AuctionFormData = {
    itemName: auction.itemName,
    description: auction.description,
    startingBid: auction.startingBid,
    bidStart: auction.bidStart.slice(0, 16),
    bidEnd: auction.bidEnd.slice(0, 16),
  };

  return (
    <IfOwner ownerId={auction.seller._id}>
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-2xl">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">Редактирование аукциона</h1>
        <AuctionForm initialData={initialData} onSubmit={handleSubmit} submitLabel="Обновить аукцион" isLoading={loading} />
      </main>
    </IfOwner>
  );
};

export default EditAuctionPage;
