// src/entities/product/ui/product-card.tsx

import { AddToCart } from "@/features/cart/ui/add-to-cart";
import { Button } from "@/shared/ui/button";
import type { Product } from "@/types";
import React from "react";
import { Link } from "react-router-dom";

interface ProductCardProps {
  product: Product;
  horizontal?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, horizontal = false }) => {
  const { _id, name, price, image, shop, created } = product;

  const formattedDate = new Date(created).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden ${horizontal ? "flex flex-col sm:flex-row" : "flex flex-col"}`}
      aria-label={`Товар: ${name}`}
    >
      {/* Изображение */}
      <img src={image} alt={name} className={`object-cover ${horizontal ? "w-full sm:w-32 h-48 sm:h-32" : "w-full h-48"}`} loading="lazy" />

      {/* Информация о товаре */}
      <div className="p-4 flex-1 flex flex-col">
        <Link
          to={`/product/${_id}`}
          className="text-lg font-semibold text-gray-900 dark:text-white hover:text-green-600 dark:hover:text-green-400 transition"
          aria-label={`Подробнее о товаре ${name}`}
        >
          {name}
        </Link>

        <Link
          to={`/shops/${shop._id}`}
          className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1 hover:text-gray-700 dark:hover:text-gray-300 transition"
          aria-label={`Перейти в магазин ${shop.name}`}
        >
          <span aria-hidden="true">🛒</span> {shop.name}
        </Link>

        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Добавлен {formattedDate}</p>

        <div className="flex flex-wrap justify-between items-center gap-3 mt-3">
          <span className="text-xl font-bold text-green-600 dark:text-green-400">{price.toLocaleString()} ₽</span>
          <div className="flex gap-2">
            <Link to={`/product/${_id}`}>
              <Button size="sm" variant="outline" aria-label={`Подробнее о ${name}`}>
                Подробнее
              </Button>
            </Link>
            <AddToCart product={product} shopId={shop._id} />
          </div>
        </div>
      </div>
    </article>
  );
};

export const MemoizedProductCard = React.memo(ProductCard);

export { ProductCard };
export default MemoizedProductCard;
