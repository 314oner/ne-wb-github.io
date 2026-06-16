// src/entities/product/ui/cart-item-row.tsx

import { Button, Input } from "@/shared/ui";
import type { CartItem } from "@/types";
import React from "react";
import { Link } from "react-router-dom";

interface CartItemRowProps {
  item: CartItem;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({ item, onQuantityChange, onRemove }) => {
  const { product, quantity } = item;
  const total = product.price * quantity;

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value, 10);
    onQuantityChange(isNaN(newQuantity) || newQuantity < 1 ? 1 : newQuantity);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow mb-4">
      {/* Изображение товара */}
      <div className="flex justify-center sm:justify-start">
        <img src={product.image} alt={product.name} className="w-32 h-32 object-cover rounded-md" loading="lazy" />
      </div>

      {/* Информация о товаре */}
      <div className="flex-1">
        <Link
          to={`/product/${product._id}`}
          className="text-lg font-semibold hover:text-green-600 dark:hover:text-green-400 transition"
          aria-label={`Перейти к товару ${product.name}`}
        >
          {product.name}
        </Link>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Магазин: {product.shop.name}</p>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">
          {/* Цена за единицу */}
          <span className="text-xl font-bold text-green-600 dark:text-green-400">{product.price.toLocaleString()} ₽</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">за шт.</span>

          {/* Количество */}
          <div className="flex items-center gap-2">
            <label htmlFor={`quantity-${product._id}`} className="text-sm font-medium">
              Кол-во:
            </label>
            <Input
              id={`quantity-${product._id}`}
              type="number"
              min={1}
              value={quantity}
              onChange={handleQuantityChange}
              className="w-20 text-center"
              aria-label="Изменить количество"
            />
          </div>

          {/* Общая стоимость позиции */}
          <span className="text-lg font-semibold">{total.toLocaleString()} ₽</span>

          {/* Кнопка удаления */}
          <Button variant="outline" size="sm" onClick={onRemove} aria-label={`Удалить ${product.name} из корзины`}>
            Удалить
          </Button>
        </div>
      </div>
    </div>
  );
};
