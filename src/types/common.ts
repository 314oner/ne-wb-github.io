declare const ID_BRAND: unique symbol;
type IdBrand<T extends string> = string & { [ID_BRAND]: T };

export type UserId = IdBrand<"User">;
export type AuctionId = IdBrand<"Auction">;
export type ProductId = IdBrand<"Product">;
export type ShopId = IdBrand<"Shop">;
export type OrderId = IdBrand<"Order">;
export type OrderItemId = IdBrand<"OrderItem">;

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pages: number;
  total: number;
}

export type ApiResponse<T> = { success: true; data: T } | { success: false; error: string };
