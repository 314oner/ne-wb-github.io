// src/views/my-auctions/index.tsx

import { Button, Spinner } from "@/shared/ui";
import { fetchMyAuctions, selectAuctionLoading, selectCurrentUser, selectMyAuctions, useAppDispatch, useAppSelector } from "@/store";
import { AuctionsList } from "@/widgets/auctions-list/ui/auctions-list";
import { useEffect } from "react";
import { Link } from "react-router-dom";

export const MyAuctionsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const auctions = useAppSelector(selectMyAuctions);
  const loading = useAppSelector(selectAuctionLoading);

  useEffect(() => {
    document.title = "Мои аукционы | Маркетплейс";
    return () => {
      document.title = "Маркетплейс";
    };
  }, []);

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchMyAuctions(user._id));
    }
  }, [dispatch, user]);

  const handleAuctionDeleted = (_auctionId: string) => {
    if (user?._id) {
      dispatch(fetchMyAuctions(user._id));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]" role="status" aria-live="polite">
        <Spinner aria-label="Загрузка ваших аукционов" />
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-3xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Мои аукционы</h1>
        <Link to="/auction/new">
          <Button variant="primary">+ Создать аукцион</Button>
        </Link>
      </div>

      {auctions.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-600 dark:text-gray-300 mb-4">У вас пока нет созданных аукционов.</p>
          <Link to="/auction/new">
            <Button variant="primary">Создать первый аукцион</Button>
          </Link>
        </div>
      ) : (
        <section aria-label="Список ваших аукционов">
          <AuctionsList auctions={auctions} showSellerActions onAuctionDeleted={handleAuctionDeleted} />
        </section>
      )}
    </main>
  );
};

export default MyAuctionsPage;
