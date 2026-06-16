import type { ProductId, ShopId } from "./common";

export interface Product {
  _id: ProductId;
  name: string;
  price: number;
  image: string;
  shop: {
    _id: ShopId;
    name: string;
  };
  created: string;
  quantity: number;
  description?: string;
  category?: string;
}

export interface CreateProductDto {
  name: string;
  price: number;
  quantity: number;
  description?: string;
  category?: string;
  image?: File | string;
}

export type UpdateProductDto = Partial<CreateProductDto>;
