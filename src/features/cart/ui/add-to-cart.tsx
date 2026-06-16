// src/features/cart/ui/add-to-cart.tsx

import { Button } from "@/shared/ui/button";
import { addToCart, useAppDispatch } from "@/store";
import type { Product, ShopId } from "@/types";
import React, { useCallback, useState } from "react";

interface AddToCartProps {
  product: Product;
  shopId: ShopId;
  className?: string;
}

export const AddToCart: React.FC<AddToCartProps> = ({ product, shopId, className }) => {
  const dispatch = useAppDispatch();
  const [added, setAdded] = useState(false);

  const handleAdd = useCallback(() => {
    dispatch(addToCart({ product, shopId }));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }, [dispatch, product, shopId]);

  return (
    <Button
      size="sm"
      variant="primary"
      onClick={handleAdd}
      className={className}
      aria-label={added ? "Товар добавлен в корзину" : "Добавить товар в корзину"}
    >
      {added ? "✓ Добавлено" : "В корзину"}
    </Button>
  );
};
