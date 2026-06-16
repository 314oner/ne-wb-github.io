// src/pages/open-auctions/index.tsx

import { Spinner } from "@/shared/ui";
import { fetchOpenAuctions, selectAuctionLoading, selectOpenAuctions, useAppDispatch, useAppSelector } from "@/store";
import { AuctionsList } from "@/widgets/auctions-list/ui/auctions-list";
import { useEffect } from "react";

export const OpenAuctionsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const auctions = useAppSelector(selectOpenAuctions);
  const loading = useAppSelector(selectAuctionLoading);

  useEffect(() => {
    document.title = "Открытые аукционы | Маркетплейс";
    return () => {
      document.title = "Маркетплейс";
    };
  }, []);

  useEffect(() => {
    dispatch(fetchOpenAuctions());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]" role="status" aria-live="polite">
        <Spinner aria-label="Загрузка активных аукционов" />
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-3xl">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Активные аукционы</h1>

      {auctions.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-600 dark:text-gray-300">На данный момент нет активных аукционов.</p>
          <a href="/" className="inline-block mt-4 text-blue-600 dark:text-blue-400 hover:underline">
            Вернуться на главную
          </a>
        </div>
      ) : (
        <section aria-label="Список активных аукционов">
          <AuctionsList auctions={auctions} />
        </section>
      )}
    </main>
  );
};

export default OpenAuctionsPage;
