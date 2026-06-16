// src/widgets/auctions-list/ui/auctions-list.tsx

import { DeleteAuctionButton } from "@/features/auction-delete/ui/delete-auction-button";
import { getAuctionStatus, getTimeLeft } from "@/shared/lib/auction-utils";
import { selectCurrentUser } from "@/store";
import { Auction } from "@/types";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

interface AuctionsListProps {
  auctions: Auction[];
  showSellerActions?: boolean;
  onAuctionDeleted?: (auctionId: string) => void;
}

export const AuctionsList: React.FC<AuctionsListProps> = ({ auctions, showSellerActions = false, onAuctionDeleted }) => {
  const user = useSelector(selectCurrentUser);
  const isSeller = (sellerId: string) => user?._id === sellerId;

  return (
    <div className="space-y-3">
      {auctions.map((auction) => {
        const status = getAuctionStatus(auction);
        const statusText = status === "live" ? "🟢 Live" : status === "not_started" ? "⏳ Upcoming" : "🔴 Ended";
        const timeInfo = status === "live" ? getTimeLeft(auction) : new Date(auction.bidStart).toLocaleString();
        return (
          <div key={auction._id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex gap-4 items-center">
            <img src={auction.image} alt={auction.itemName} className="w-20 h-20 object-cover rounded" />
            <div className="flex-1">
              <Link to={`/auction/${auction._id}`} className="text-lg font-semibold hover:text-wcag-green">
                {auction.itemName}
              </Link>
              <div className="text-sm text-gray-500">{statusText}</div>
              <div className="text-sm">{status === "live" ? `Ends in ${timeInfo}` : `Starts at ${timeInfo}`}</div>
              {auction.bids.length > 0 && <div className="text-sm">Last bid: ₽{auction.bids[0].bid}</div>}
            </div>
            {showSellerActions && isSeller(auction.seller._id) && (
              <div className="flex gap-2">
                {/* Исправлено: убрали лишний тег button и перенесли классы прямо на Link */}
                <Link to={`/auction/edit/${auction._id}`} className="px-3 py-1 text-sm border rounded hover:bg-gray-100 block">
                  Edit
                </Link>
                <DeleteAuctionButton auction={auction} onDeleted={() => onAuctionDeleted?.(auction._id)} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
