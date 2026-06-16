import type { UserId } from "./common";

export interface Bid {
  bidder: {
    _id: UserId;
    name: string;
  };
  bid: number;
  time: string; // ISO 8601
}
