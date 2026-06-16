import type { ShopId, UserId } from "./common";

export interface Shop {
  _id: ShopId;
  name: string;
  description: string;
  image: string;
  owner: {
    _id: UserId;
    name: string;
  };
  created: string;
  updated: string;
}

export interface CreateShopDto {
  name: string;
  description: string;
  image?: File | string;
}

export type UpdateShopDto = Partial<CreateShopDto>;
