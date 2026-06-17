import type { Auction, AuctionId, Bid, CreateAuctionDto, UpdateAuctionDto, UserId } from "@/types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../index";
import { mockAuctions } from "../mocks/auction-mocks";

export const fetchOpenAuctions = createAsyncThunk<Auction[], void, { state: RootState }>("auction/fetchOpen", async () => {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return mockAuctions.filter((a) => new Date(a.bidEnd) > new Date());
});

export const fetchMyAuctions = createAsyncThunk<Auction[], UserId, { state: RootState }>("auction/fetchMy", async (userId) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockAuctions.filter((a) => a.seller._id === userId);
});

export const fetchAuctionById = createAsyncThunk<Auction, AuctionId, { state: RootState }>("auction/fetchById", async (auctionId) => {
  await new Promise((resolve) => setTimeout(resolve, 400));
  const auction = mockAuctions.find((a) => a._id === auctionId);
  if (!auction) throw new Error("Auction not found");
  return auction;
});

export const createAuction = createAsyncThunk<Auction, CreateAuctionDto, { state: RootState }>("auction/create", async (formData, { getState }) => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  const currentUser = getState().user.current;
  const newAuction: Auction = {
    _id: `auc_${Date.now()}` as AuctionId,
    itemName: formData.itemName,
    description: formData.description,
    startingBid: formData.startingBid,
    bidStart: formData.bidStart,
    bidEnd: formData.bidEnd,
    image: `${import.meta.env.BASE_URL}images/default-auction.jpg`,
    seller: {
      _id: currentUser?._id ?? ("anonymous" as UserId),
      name: currentUser?.name ?? "Anonymous",
    },
    bids: [],
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
  };
  return newAuction;
});

export const updateAuction = createAsyncThunk<
  { auctionId: AuctionId; itemName?: string; description?: string; startingBid?: number; bidStart?: string; bidEnd?: string; image?: string },
  { auctionId: AuctionId; formData: UpdateAuctionDto },
  { state: RootState }
>("auction/update", async ({ auctionId, formData }) => {
  await new Promise((resolve) => setTimeout(resolve, 700));
  const { image, ...rest } = formData;
  const updatedImage: string | undefined = image ? `${import.meta.env.BASE_URL}images/updated-auction.jpg` : undefined;
  return { auctionId, ...rest, image: updatedImage };
});

export const deleteAuction = createAsyncThunk<AuctionId, AuctionId, { state: RootState }>("auction/delete", async (auctionId) => {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return auctionId;
});

export const placeBid = createAsyncThunk<
  { auctionId: AuctionId; newBid: Bid },
  { auctionId: AuctionId; bid: number; bidder: { _id: UserId; name: string } },
  { state: RootState }
>("auction/placeBid", async ({ auctionId, bid, bidder }) => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const newBid: Bid = {
    bidder,
    bid,
    time: new Date().toISOString(),
  };
  return { auctionId, newBid };
});
