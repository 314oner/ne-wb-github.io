// src/shared/api/auth-api.ts

import authClient from "./axios-auth-instance"; // withCredentials: true
import api from "./axios-instance";

export interface UserDTO {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  profile_picture?: string;
  createdAt?: string;
  is_confirmed?: boolean;
  followersCount?: number;
  followingCount?: number;
  publicKey?: string | null;
}
export const authApi = {
  getYandexAuthUrl: () => api.get<{ url: string }>("/nestApi/v1/yandex/url", { withCredentials: false }),
  exchangeCode: (code: string) => authClient.post<{ user: UserDTO; token: string }>("/nestApi/v1/yandex/callback", { code }),
  getCurrentUser: () => authClient.get<UserDTO>("/nestApi/v1/auth/me"),
  logout: () => authClient.post("/nestApi/v1/auth/logout"),
};
