// src/shared/lib/auction-utils.ts

import { Auction } from "@/types";

export type AuctionStatus = "not_started" | "live" | "ended";

export function getAuctionStatus(auction: Auction): AuctionStatus {
  const now = new Date();
  const start = new Date(auction.bidStart);
  const end = new Date(auction.bidEnd);
  if (now < start) return "not_started";
  if (now > end) return "ended";
  return "live";
}

export function getTimeLeft(auction: Auction): string {
  const end = new Date(auction.bidEnd);
  const diff = end.getTime() - Date.now();
  if (diff <= 0) return "Auction ended";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % 86400000) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % 3600000) / (1000 * 60));
  const seconds = Math.floor((diff % 60000) / 1000);
  return `${days ? days + "d " : ""}${hours}h ${minutes}m ${seconds}s`;
}
