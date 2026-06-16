// src/features/checkout/ui/checkout-form.tsx

import { Button, Input } from "@/shared/ui";
import { clearCart, createOrder, selectCartItems, selectCurrentUser, selectOrderLoading, useAppDispatch, useAppSelector } from "@/store";
import type { DeliveryAddress } from "@/types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface CheckoutFormData {
  customer_name: string;
  customer_email: string;
  delivery_address: DeliveryAddress;
}

type FormField = keyof Omit<CheckoutFormData, "delivery_address">;
type AddressField = keyof DeliveryAddress;
type FormErrors = Partial<Record<FormField | AddressField, string>>;

export const CheckoutForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const cartItems = useAppSelector(selectCartItems);
  const user = useAppSelector(selectCurrentUser);
  const isLoading = useAppSelector(selectOrderLoading);

  const [formData, setFormData] = useState<CheckoutFormData>({
    customer_name: user?.name || "",
    customer_email: user?.email || "",
    delivery_address: {
      street: "",
      city: "",
      state: "",
      zipcode: "",
      country: "",
    },
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleInputChange = <K extends FormField>(field: K, value: string): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const { [field]: _, ...rest } = prev;
      return rest;
    });
  };

  const handleAddressChange = <K extends AddressField>(field: K, value: string): void => {
    setFormData((prev) => ({
      ...prev,
      delivery_address: { ...prev.delivery_address, [field]: value },
    }));
    setErrors((prev) => {
      const { [field]: _, ...rest } = prev;
      return rest;
    });
  };

  const markTouched = (field: string) => {
    if (!touched[field]) {
      setTouched((prev) => ({ ...prev, [field]: true }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.customer_name.trim()) newErrors.customer_name = "Имя обязательно";
    if (!formData.customer_email.trim()) newErrors.customer_email = "Email обязателен";
    else if (!/\S+@\S+\.\S+/.test(formData.customer_email)) newErrors.customer_email = "Введите корректный email";
    if (!formData.delivery_address.street.trim()) newErrors.street = "Улица обязательна";
    if (!formData.delivery_address.city.trim()) newErrors.city = "Город обязателен";
    if (!formData.delivery_address.zipcode.trim()) newErrors.zipcode = "Индекс обязателен";
    if (!formData.delivery_address.country.trim()) newErrors.country = "Страна обязательна";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!validate()) return;

    // В реальном приложении токен получается от платёжной системы
    const mockTokenId = `tok_mock_${Date.now()}`;

    try {
      const result = await dispatch(
        createOrder({
          order: {
            products: cartItems,
            customer_name: formData.customer_name,
            customer_email: formData.customer_email,
            delivery_address: formData.delivery_address,
          },
          tokenId: mockTokenId,
        }),
      ).unwrap();

      dispatch(clearCart());
      toast.success("Заказ успешно оформлен!");
      navigate(`/order/${result._id}`);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Не удалось оформить заказ. Попробуйте позже.";
      toast.error(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6 space-y-4">
      <h2 className="text-xl sm:text-2xl font-bold mb-4">Оформление заказа</h2>

      <Input
        label="Полное имя"
        value={formData.customer_name}
        onChange={(e) => handleInputChange("customer_name", e.target.value)}
        onBlur={() => markTouched("customer_name")}
        error={touched.customer_name ? errors.customer_name : undefined}
        required
        disabled={isLoading}
      />

      <Input
        label="Email"
        type="email"
        value={formData.customer_email}
        onChange={(e) => handleInputChange("customer_email", e.target.value)}
        onBlur={() => markTouched("customer_email")}
        error={touched.customer_email ? errors.customer_email : undefined}
        required
        disabled={isLoading}
      />

      <div className="border-t pt-4 mt-2">
        <h3 className="text-lg font-semibold mb-3">Адрес доставки</h3>
        <div className="space-y-3">
          <Input
            label="Улица"
            value={formData.delivery_address.street}
            onChange={(e) => handleAddressChange("street", e.target.value)}
            onBlur={() => markTouched("street")}
            error={touched.street ? errors.street : undefined}
            required
            disabled={isLoading}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Город"
              value={formData.delivery_address.city}
              onChange={(e) => handleAddressChange("city", e.target.value)}
              onBlur={() => markTouched("city")}
              error={touched.city ? errors.city : undefined}
              required
              disabled={isLoading}
            />
            <Input
              label="Область / Регион"
              value={formData.delivery_address.state}
              onChange={(e) => handleAddressChange("state", e.target.value)}
              onBlur={() => markTouched("state")}
              disabled={isLoading}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Почтовый индекс"
              value={formData.delivery_address.zipcode}
              onChange={(e) => handleAddressChange("zipcode", e.target.value)}
              onBlur={() => markTouched("zipcode")}
              error={touched.zipcode ? errors.zipcode : undefined}
              required
              disabled={isLoading}
            />
            <Input
              label="Страна"
              value={formData.delivery_address.country}
              onChange={(e) => handleAddressChange("country", e.target.value)}
              onBlur={() => markTouched("country")}
              error={touched.country ? errors.country : undefined}
              required
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      {/* Демо-блок платёжных данных */}
      <div className="border rounded-md p-3 bg-gray-50 dark:bg-gray-700 mt-4" role="note" aria-label="Демонстрационные данные карты">
        <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">Данные карты (демо-режим)</p>
        <div className="h-10 bg-white dark:bg-gray-600 rounded flex items-center px-3 text-gray-400 font-mono text-sm" aria-hidden="true">
          4242 4242 4242 4242 &nbsp;|&nbsp; 12/28 &nbsp;|&nbsp; 123
        </div>
        <p className="text-xs text-gray-400 mt-2">Для тестирования используйте любой тестовый номер карты</p>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? "Обработка..." : "Оформить заказ"}
        </Button>
      </div>
    </form>
  );
};
