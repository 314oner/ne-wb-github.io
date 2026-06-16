import type { Auction, AuctionId, UserId } from "@/types";

export const mockAuctions: Auction[] = [
  {
    _id: "a1" as AuctionId,
    itemName: "Vintage Rolex Watch",
    description: "Rare 1960s Rolex Submariner in excellent condition.",
    image: "/images/rolex.webp",
    startingBid: 1000,
    bidStart: new Date(Date.now() - 86400000).toISOString(),
    bidEnd: new Date(Date.now() + 86400000).toISOString(),
    seller: {
      _id: "u1" as UserId,
      name: "John Doe",
    },
    bids: [
      {
        bidder: { _id: "u2" as UserId, name: "Jane Smith" },
        bid: 1200,
        time: new Date(Date.now() - 7200000).toISOString(),
      },
      {
        bidder: { _id: "u1" as UserId, name: "John Doe" },
        bid: 1100,
        time: new Date(Date.now() - 14400000).toISOString(),
      },
    ],
    created: new Date(Date.now() - 172800000).toISOString(),
    updated: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    _id: "a2" as AuctionId,
    itemName: "Handmade Leather Wallet",
    description: "Genuine leather wallet, hand-stitched.",
    image: "/images/avatars/2.svg",
    startingBid: 20,
    bidStart: new Date(Date.now() - 172800000).toISOString(),
    bidEnd: new Date(Date.now() - 86400000).toISOString(),
    seller: { _id: "u2" as UserId, name: "Jane Smith" },
    bids: [
      {
        bidder: { _id: "u3" as UserId, name: "Bob Johnson" },
        bid: 45,
        time: new Date(Date.now() - 129600000).toISOString(),
      },
    ],
    created: new Date(Date.now() - 259200000).toISOString(),
    updated: new Date(Date.now() - 172800000).toISOString(),
  },
];
