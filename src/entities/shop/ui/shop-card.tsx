// src/entities/shop/ui/shop-card.tsx

import type { Shop } from "@/types";
import React from "react";
import { Link } from "react-router-dom";

interface ShopCardProps {
  shop: Shop;
  actions?: React.ReactNode;
}

export const ShopCard: React.FC<ShopCardProps> = ({ shop, actions }) => {
  const { _id, name, description, image, owner } = shop;

  return (
    <article
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition hover:shadow-lg flex flex-col"
      aria-label={`Магазин: ${name}`}
    >
      <Link to={`/shops/${_id}`} aria-label={`Перейти в магазин ${name}`}>
        <img src={image} alt={`Логотип магазина ${name}`} className="w-full h-48 object-cover transition hover:opacity-90" loading="lazy" />
      </Link>
      <div className="p-4 flex-1 flex flex-col">
        <Link
          to={`/shops/${_id}`}
          className="text-xl font-bold text-gray-900 dark:text-white hover:text-green-600 dark:hover:text-green-400 transition"
        >
          {name}
        </Link>
        <p className="text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">{description}</p>
        <div className="flex flex-wrap justify-between items-center gap-2 mt-3">
          <span className="text-sm text-gray-500 dark:text-gray-400">Владелец: {owner.name}</span>
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>
      </div>
    </article>
  );
};
