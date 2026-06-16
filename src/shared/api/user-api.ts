import axiosInstance from "./axios-instance";

export const userApi = {
  updateProfile: (data: { name?: string; email?: string; seller?: boolean }) => axiosInstance.put("/users/profile", data),

  deleteAccount: () => axiosInstance.delete("/nestApi/v1/users/profile"),

  getUserById: (userId: string) => axiosInstance.get(`/nestApi/v1/users/${userId}`),

  getMyBids: () => axiosInstance.get("/nestApi/v1/users/me/bids"),
  getMyShops: () => axiosInstance.get("/nestApi/v1/users/me/shops"),
  getMyAuctions: () => axiosInstance.get("/nestApi/v1/users/me/auctions"),
};
