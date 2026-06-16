import type { Bid } from "./bid";
import type { AuctionId, UserId } from "./common";

export interface Auction {
  _id: AuctionId;
  itemName: string;
  description: string;
  image: string;
  startingBid: number;
  bidStart: string;
  bidEnd: string;
  seller: {
    _id: UserId;
    name: string;
  };
  bids: Bid[];
  created: string;
  updated: string;
}

export interface CreateAuctionDto {
  itemName: string;
  description: string;
  startingBid: number;
  bidStart: string;
  bidEnd: string;
  image?: File | string; // на фронте FormData, на бэке – путь/файл
}

export type UpdateAuctionDto = Partial<Omit<CreateAuctionDto, "image">> & {
  image?: File | string;
};
