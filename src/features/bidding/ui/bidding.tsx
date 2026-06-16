// src/features/bidding/ui/bidding.tsx

import { Button, Input } from "@/shared/ui";
import { addBidToCurrentAuction, useAppDispatch, useAppSelector } from "@/store";
import { selectCurrentUser } from "@/store/slices/user-slice";
import type { Auction, Bid } from "@/types";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

// Глобальный сокет
let globalSocket: Socket | null = null;

interface BiddingProps {
  auction: Auction;
  justEnded: boolean;
}

export const Bidding: React.FC<BiddingProps> = ({ auction, justEnded }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const [bidAmount, setBidAmount] = useState<string>("");
  const socketRef = useRef<Socket | null>(null);

  const currentDate = new Date();
  const isLive = currentDate > new Date(auction.bidStart) && currentDate < new Date(auction.bidEnd);
  const highestBid = auction.bids.length > 0 ? auction.bids[0].bid : auction.startingBid;
  const minNextBid = highestBid + 1;

  // Инициализация сокета и подключение к комнате
  useEffect(() => {
    if (!globalSocket) {
      globalSocket = io(import.meta.env.VITE_SOCKET_URL || "/");
    }
    socketRef.current = globalSocket;

    // Присоединяемся к комнате аукциона
    socketRef.current.emit("join auction room", { room: auction._id });

    // Обработчик новых ставок
    const handleNewBid = (payload: { bid: Bid }) => {
      dispatch(addBidToCurrentAuction(payload.bid));
    };
    socketRef.current.on("new bid", handleNewBid);

    return () => {
      // Выходим из комнаты при размонтировании
      socketRef.current?.emit("leave auction room", { room: auction._id });
      socketRef.current?.off("new bid", handleNewBid);
    };
  }, [auction._id, dispatch]);

  const handlePlaceBid = () => {
    if (!user || !socketRef.current) return;
    const bid = parseFloat(bidAmount);
    if (isNaN(bid) || bid < minNextBid) return;

    const newBid: Bid = {
      bid,
      time: new Date().toISOString(),
      bidder: { _id: user._id, name: user.name },
    };
    socketRef.current.emit("new bid", {
      room: auction._id,
      bidInfo: newBid,
    });
    setBidAmount("");
  };

  // Если аукцион не активен или только что завершился – не показываем форму
  if (!isLive || justEnded) return null;

  return (
    <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
      <h3 className="text-lg font-semibold mb-3">Сделать ставку</h3>
      <div className="flex flex-col sm:flex-row gap-4 items-end">
        <div className="flex-1 sm:flex-none">
          <Input
            type="number"
            step="1"
            min={minNextBid}
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            placeholder={`Мин. ставка: ${minNextBid} ₽`}
            className="w-full sm:w-48"
            aria-label="Сумма ставки"
            disabled={!user}
          />
        </div>
        <Button onClick={handlePlaceBid} disabled={!user || !bidAmount || parseFloat(bidAmount) < minNextBid} aria-label="Разместить ставку">
          {!user ? "Войдите, чтобы ставить" : "Сделать ставку"}
        </Button>
      </div>

      {/* История ставок */}
      <div className="mt-4">
        <h4 className="font-semibold mb-2">История ставок</h4>
        <div
          className="mt-2 space-y-1 max-h-60 overflow-y-auto border-t border-gray-200 dark:border-gray-600 pt-2"
          role="log"
          aria-live="polite"
          aria-label="Список сделанных ставок"
        >
          {auction.bids.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">Пока нет ставок</p>
          ) : (
            auction.bids.map((bid, index) => {
              // IDX и ID ставки
              const bidKey = `${bid.bidder._id}-${new Date(bid.time).getTime()}-${index}`;
              return (
                <div key={bidKey} className="text-sm flex flex-wrap justify-between gap-2 py-1 border-b border-gray-200 dark:border-gray-700">
                  <span className="font-medium text-green-600 dark:text-green-400">{bid.bid.toLocaleString()} ₽</span>
                  <span className="text-gray-500 dark:text-gray-400">{new Date(bid.time).toLocaleString()}</span>
                  <span className="text-gray-700 dark:text-gray-300">{bid.bidder.name}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
