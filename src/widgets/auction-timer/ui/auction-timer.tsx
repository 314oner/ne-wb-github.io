// src/widgets/auction-timer/ui/auction-timer.tsx

import { getTimeLeft } from "@/shared/lib/auction-utils";
import React, { useEffect, useState } from "react";

interface AuctionTimerProps {
  endTime: string;
  onEnd?: () => void;
}

const translateTimerMessage = (message: string): string => {
  switch (message) {
    case "Auction ended":
      return "Аукцион завершён";
    case "Auction not started":
      return "Аукцион не начался";
    default:
      return message;
  }
};

export const AuctionTimer: React.FC<AuctionTimerProps> = ({ endTime, onEnd }) => {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [ended, setEnded] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const left = getTimeLeft({ bidEnd: endTime } as any);
      const translated = translateTimerMessage(left);
      setTimeLeft(translated);

      if (left === "Auction ended" && !ended && onEnd) {
        setEnded(true);
        onEnd();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime, onEnd, ended]);

  const ariaLabel = timeLeft === "Аукцион завершён" ? "Аукцион завершён" : `До окончания аукциона осталось: ${timeLeft}`;

  return (
    <div className="text-lg font-semibold text-green-600 dark:text-green-400" role="timer" aria-live="polite" aria-label={ariaLabel}>
      {timeLeft || "Загрузка..."}
    </div>
  );
};
