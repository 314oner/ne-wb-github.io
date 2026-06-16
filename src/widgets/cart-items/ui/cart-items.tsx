// src/widgets/cart-items/ui/cart-items.tsx

import { CartItemRow } from "@/entities/product";
import { Button } from "@/shared/ui";
import { removeFromCart, selectCartItems, selectIsAuthenticated, updateQuantity, useAppDispatch, useAppSelector } from "@/store";
import type { ProductId } from "@/types";
import { Link, useNavigate } from "react-router-dom";

interface CartItemsProps {
  onProceedToCheckout: () => void;
}

export const CartItems: React.FC<CartItemsProps> = ({ onProceedToCheckout }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const cartItems = useAppSelector(selectCartItems);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleQuantityChange = (productId: ProductId, quantity: number): void => {
    dispatch(updateQuantity({ productId, quantity }));
  };

  const handleRemove = (productId: ProductId): void => {
    dispatch(removeFromCart(productId));
  };

  const handleCheckout = (): void => {
    if (!isAuthenticated) {
      navigate("/signin");
    } else {
      onProceedToCheckout();
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Корзина</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Ваша корзина пуста</p>
        <Link to="/">
          <Button variant="primary">Продолжить покупки</Button>
        </Link>
      </div>
    );
  }

  return (
    <section className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6 flex flex-col items-center" aria-labelledby="cart-heading">
      <h2 id="cart-heading" className="text-2xl font-bold mb-6">
        Корзина
      </h2>

      <div className="space-y-4">
        {cartItems.map((item) => (
          <CartItemRow
            key={item.product._id}
            item={item}
            onQuantityChange={(quantity) => handleQuantityChange(item.product._id, quantity)}
            onRemove={() => handleRemove(item.product._id)}
          />
        ))}
      </div>

      <div className="border-t dark:border-gray-700 mt-6 pt-4 flex flex-wrap justify-between items-center gap-4">
        <span className="text-xl font-bold">Итого: {total.toLocaleString()} ₽</span>
        <div className="flex flex-wrap gap-3">
          <Button variant="primary" onClick={handleCheckout}>
            {isAuthenticated ? "Оформить заказ" : "Войдите, чтобы оформить"}
          </Button>
          <Link to="/">
            <Button variant="outline">Продолжить покупки</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
