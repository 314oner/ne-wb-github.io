import type { Shop, ShopId, UserId } from "@/types";

export const mockShops: Shop[] = [
  {
    _id: "s1" as ShopId,
    name: "Antique Store",
    description: "Fine antiques from 19th century",
    image: "/images/default-shop.jpg",
    owner: { _id: "u1" as UserId, name: "Joe Peach" },
    created: "2025-01-15T10:00:00Z",
    updated: "2025-01-15T10:00:00Z",
  },
  {
    _id: "s2" as ShopId,
    name: "Artisan Shop",
    description: "Handmade crafts",
    image: "/images/artisan_shop.avif",
    owner: { _id: "u2" as UserId, name: "Pierre Dunn" },
    created: "2025-02-20T14:30:00Z",
    updated: "2025-02-20T14:30:00Z",
  },
];
