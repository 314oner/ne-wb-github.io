import type { ShopId } from "./common";
import type { Product } from "./product";

export interface CartItem {
  product: Product;
  quantity: number;
  shop: ShopId; // ID магазина
}
