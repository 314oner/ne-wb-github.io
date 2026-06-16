// src/pages/auction/index.tsx

import { Bidding } from "@/features/bidding/ui/bidding";
import { getAuctionStatus } from "@/shared/lib/auction-utils";
import { Spinner } from "@/shared/ui";
import {
  clearCurrentAuction,
  fetchAuctionById,
  selectAuctionError,
  selectAuctionLoading,
  selectCurrentAuction,
  selectCurrentUser,
  useAppDispatch,
  useAppSelector,
} from "@/store";
import { AuctionTimer } from "@/widgets/auction-timer/ui/auction-timer";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

interface AuctionRouteParams extends Record<string, string | undefined> {
  auctionId: string;
}

export const AuctionPage: React.FC = () => {
  const { auctionId } = useParams<AuctionRouteParams>();
  const dispatch = useAppDispatch();
  const auction = useAppSelector(selectCurrentAuction);
  const loading = useAppSelector(selectAuctionLoading);
  const error = useAppSelector(selectAuctionError);
  const user = useAppSelector(selectCurrentUser);
  const [justEnded, setJustEnded] = useState<boolean>(false);

  useEffect(() => {
    if (auctionId) {
      dispatch(fetchAuctionById(auctionId as any));
    }
    return () => {
      dispatch(clearCurrentAuction());
    };
  }, [dispatch, auctionId]);

  const handleAuctionEnd = (): void => {
    setJustEnded(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]" role="status" aria-live="polite">
        <Spinner aria-label="Загрузка аукциона" />
      </div>
    );
  }

  if (error || !auction) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="p-4 bg-red-100 text-red-700 rounded-md" role="alert">
          {error || "Аукцион не найден"}
        </div>
        <Link to="/auctions" className="mt-4 inline-block text-blue-600 hover:underline">
          ← Вернуться к списку аукционов
        </Link>
      </div>
    );
  }

  const status = getAuctionStatus(auction);

  const statusMessage = {
    live: "🟢 Аукцион идёт",
    not_started: "⏳ Аукцион не начался",
    ended: "🔴 Аукцион завершён",
  }[status];

  const startTime = new Date(auction.bidStart).toLocaleString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const endTime = new Date(auction.bidEnd).toLocaleString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-5xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {/* Левая колонка – изображение и описание */}
        <section aria-labelledby="auction-image-heading">
          <img
            src={auction.image}
            alt={`Изображение лота: ${auction.itemName}`}
            className="w-full rounded-lg shadow-md object-cover aspect-square"
            loading="lazy"
          />
          <div className="mt-4">
            <h2 id="auction-image-heading" className="text-xl font-semibold mb-2">
              О лоте
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{auction.description}</p>
          </div>
        </section>

        {/* Правая колонка – информация и ставки */}
        <section aria-labelledby="auction-details-heading">
          <h1 id="auction-details-heading" className="text-2xl sm:text-3xl font-bold mb-2">
            {auction.itemName}
          </h1>
          <div className="text-sm mb-4" role="status" aria-live="polite" aria-label={`Статус аукциона: ${statusMessage}`}>
            {statusMessage}
          </div>

          <div className="mb-4 text-sm text-gray-500">
            <p>Начало: {startTime}</p>
            <p>Окончание: {endTime}</p>
          </div>

          {status === "live" && (
            <>
              <AuctionTimer endTime={auction.bidEnd} onEnd={handleAuctionEnd} />
              {auction.bids.length > 0 && (
                <div className="mt-2 text-lg font-semibold">Последняя ставка: {auction.bids[0].bid.toLocaleString()} ₽</div>
              )}
              {!user ? (
                <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-md" role="note">
                  Чтобы сделать ставку,{" "}
                  <Link to="/signin" className="text-blue-600 dark:text-blue-400 underline hover:no-underline">
                    войдите в аккаунт
                  </Link>
                  .
                </div>
              ) : (
                <Bidding auction={auction} justEnded={justEnded} />
              )}
            </>
          )}

          {status === "not_started" && (
            <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-md" role="note">
              Аукцион начнётся {startTime}. Приходите позже, чтобы сделать ставку.
            </div>
          )}

          {status === "ended" && (
            <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-md" role="note">
              Аукцион завершён. {auction.bids.length > 0 ? `Победившая ставка: ${auction.bids[0].bid.toLocaleString()} ₽` : "Ставок не было."}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default AuctionPage;
