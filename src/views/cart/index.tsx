// src/views/cart/index.tsx

import { CartItems } from "@/widgets/cart-items/ui/cart-items";
import { lazy, Suspense, useEffect, useRef, useState } from "react";

const CheckoutForm = lazy(() =>
  import("@/features/checkout/ui/checkout-form").then((module) => ({
    default: module.CheckoutForm,
  })),
);

export const CartPage: React.FC = () => {
  const [showCheckout, setShowCheckout] = useState<boolean>(false);
  const checkoutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showCheckout && checkoutRef.current) {
      checkoutRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      const firstInput = checkoutRef.current.querySelector('input, textarea, button, [tabindex]:not([tabindex="-1"])') as HTMLElement | null;
      firstInput?.focus();
    }
  }, [showCheckout]);

  const handleProceedToCheckout = () => {
    setShowCheckout(true);
  };

  return (
    <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Корзина</h1>

      <div className={showCheckout ? "grid grid-cols-1 lg:grid-cols-2 gap-8" : "flex justify-center"}>
        {/* Секция с товарами */}
        <section aria-labelledby="cart-items-heading">
          <h2 id="cart-items-heading" className="sr-only">
            Товары в корзине
          </h2>
          <div className={showCheckout ? "w-full max-w-lg mx-auto lg:mx-0" : "w-full max-w-lg"}>
            <CartItems onProceedToCheckout={handleProceedToCheckout} />
          </div>
        </section>

        {/* Секция оформления заказа */}
        {showCheckout && (
          <section ref={checkoutRef} aria-labelledby="checkout-heading" className="animate-fadeIn">
            <h2 id="checkout-heading" className="text-xl font-semibold mb-4">
              Оформление заказа
            </h2>
            <Suspense
              fallback={
                <div className="flex justify-center py-8" role="status" aria-live="polite">
                  <div className="spinner-border animate-spin w-8 h-8 border-4 rounded-full border-t-blue-600" />
                  <span className="sr-only">Загрузка формы оформления...</span>
                </div>
              }
            >
              <CheckoutForm />
            </Suspense>
          </section>
        )}
      </div>
    </main>
  );
};

export default CartPage;
