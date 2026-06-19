import publicClient from "./axios-instance";

export const userApi = {
  updateProfile: (data: { name?: string; email?: string; seller?: boolean }) => publicClient.put("/users/profile", data),

  deleteAccount: () => publicClient.delete("/nestApi/v1/users/profile"),

  getUserById: (userId: string) => publicClient.get(`/nestApi/v1/users/${userId}`),

  getMyBids: () => publicClient.get("/nestApi/v1/users/me/bids"),

  getMyShops: () => publicClient.get("/nestApi/v1/users/me/shops"),

  getMyAuctions: () => publicClient.get("/nestApi/v1/users/me/auctions"),
};
