import { Auction, AuctionId, Bid, UpdateAuctionDto } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";
import {
  createAuction,
  deleteAuction,
  fetchAuctionById,
  fetchMyAuctions,
  fetchOpenAuctions,
  placeBid,
  updateAuction,
} from "../thunks/auction-thunks";

interface AuctionState {
  openAuctions: Auction[];
  myAuctions: Auction[];
  currentAuction: Auction | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuctionState = {
  openAuctions: [],
  myAuctions: [],
  currentAuction: null,
  loading: false,
  error: null,
};

const auctionSlice = createSlice({
  name: "auction",
  initialState,
  reducers: {
    clearCurrentAuction(state) {
      state.currentAuction = null;
    },
    addBidToCurrentAuction(state, action: PayloadAction<Bid>) {
      if (state.currentAuction) {
        state.currentAuction.bids.unshift(action.payload);
      }
    },
    addBidToOpenAuction(state, action: PayloadAction<{ auctionId: AuctionId; bid: Bid }>) {
      const auction = state.openAuctions.find((a) => a._id === action.payload.auctionId);
      if (auction) auction.bids.unshift(action.payload.bid);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOpenAuctions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOpenAuctions.fulfilled, (state, action: PayloadAction<Auction[]>) => {
        state.openAuctions = action.payload;
        state.loading = false;
      })
      .addCase(fetchOpenAuctions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load auctions";
      })
      .addCase(fetchMyAuctions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyAuctions.fulfilled, (state, action: PayloadAction<Auction[]>) => {
        state.myAuctions = action.payload;
        state.loading = false;
      })
      .addCase(fetchMyAuctions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load your auctions";
      })
      .addCase(fetchAuctionById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAuctionById.fulfilled, (state, action: PayloadAction<Auction>) => {
        state.currentAuction = action.payload;
        state.loading = false;
      })
      .addCase(fetchAuctionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Auction not found";
      })
      .addCase(createAuction.pending, (state) => {
        state.loading = true;
      })
      .addCase(createAuction.fulfilled, (state, action: PayloadAction<Auction>) => {
        state.myAuctions.unshift(action.payload);
        state.loading = false;
      })
      .addCase(createAuction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create auction";
      })
      .addCase(updateAuction.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateAuction.fulfilled, (state, action: PayloadAction<UpdateAuctionDto & { auctionId: AuctionId; image?: string }>) => {
        const { auctionId, itemName, description, startingBid, bidStart, bidEnd, image } = action.payload;
        const updateAuctionInList = (auction: Auction) => {
          if (auction._id === auctionId) {
            if (itemName) auction.itemName = itemName;
            if (description) auction.description = description;
            if (startingBid !== undefined) auction.startingBid = startingBid;
            if (bidStart) auction.bidStart = bidStart;
            if (bidEnd) auction.bidEnd = bidEnd;
            if (image) auction.image = image;
            auction.updated = new Date().toISOString();
          }
        };
        const myAuction = state.myAuctions.find((a) => a._id === auctionId);
        if (myAuction) updateAuctionInList(myAuction);
        if (state.currentAuction?._id === auctionId) updateAuctionInList(state.currentAuction);
        state.loading = false;
      })
      .addCase(updateAuction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update auction";
      })
      .addCase(deleteAuction.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAuction.fulfilled, (state, action: PayloadAction<AuctionId>) => {
        state.myAuctions = state.myAuctions.filter((a) => a._id !== action.payload);
        if (state.currentAuction?._id === action.payload) state.currentAuction = null;
        state.loading = false;
      })
      .addCase(deleteAuction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete auction";
      })
      .addCase(placeBid.fulfilled, (state, action: PayloadAction<{ auctionId: AuctionId; newBid: Bid }>) => {
        const { auctionId, newBid } = action.payload;
        if (state.currentAuction?._id === auctionId) {
          state.currentAuction.bids.unshift(newBid);
        }
        const openAuction = state.openAuctions.find((a) => a._id === auctionId);
        if (openAuction) openAuction.bids.unshift(newBid);
      });
  },
});

export const { clearCurrentAuction, addBidToCurrentAuction, addBidToOpenAuction } = auctionSlice.actions;
export default auctionSlice.reducer;

export const selectOpenAuctions = (state: RootState) => state.auction.openAuctions;
export const selectMyAuctions = (state: RootState) => state.auction.myAuctions;
export const selectCurrentAuction = (state: RootState) => state.auction.currentAuction;
export const selectAuctionLoading = (state: RootState) => state.auction.loading;
export const selectAuctionError = (state: RootState) => state.auction.error;
