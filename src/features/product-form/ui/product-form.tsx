// src/features/product-form/ui/index.tsx

import { Button, Input, Select, Textarea } from "@/shared/ui";
import React, { useState } from "react";

export interface ProductFormData {
  name: string;
  description: string;
  category: string;
  quantity: number;
  price: number;
  image?: File | null;
}

export interface ProductFormProps {
  initialValues?: Partial<ProductFormData>;
  onSubmit: (data: ProductFormData) => Promise<void>;
  submitLabel: string;
  isLoading?: boolean;
}

// Расширенные категории на русском языке
const categoryOptions = [
  { value: "Электроника", label: "Электроника" },
  { value: "Смартфоны и гаджеты", label: "Смартфоны и гаджеты" },
  { value: "Компьютеры и ноутбуки", label: "Компьютеры и ноутбуки" },
  { value: "Бытовая техника", label: "Бытовая техника" },
  { value: "Одежда и обувь", label: "Одежда и обувь" },
  { value: "Аксессуары и бижутерия", label: "Аксессуары и бижутерия" },
  { value: "Дом и уют", label: "Дом и уют" },
  { value: "Книги", label: "Книги" },
  { value: "Канцелярия", label: "Канцелярия" },
  { value: "Товары для хобби", label: "Товары для хобби" },
  { value: "Спорт и фитнес", label: "Спорт и фитнес" },
  { value: "Зоотовары", label: "Зоотовары" },
  { value: "Продукты питания", label: "Продукты питания" },
  { value: "Детские товары", label: "Детские товары" },
  { value: "Красота и здоровье", label: "Красота и здоровье" },
  { value: "Автотовары", label: "Автотовары" },
  { value: "Инструменты", label: "Инструменты" },
  { value: "Сад и огород", label: "Сад и огород" },
];

export const ProductForm: React.FC<ProductFormProps> = ({ initialValues = {}, onSubmit, submitLabel, isLoading = false }) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: initialValues.name || "",
    description: initialValues.description || "",
    category: initialValues.category || categoryOptions[0].value,
    quantity: initialValues.quantity ?? 0,
    price: initialValues.price ?? 0,
    image: null,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({});

  const handleChange = (field: keyof ProductFormData, value: string | number | File | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ProductFormData, string>> = {};
    if (!formData.name.trim()) newErrors.name = "Название товара обязательно";
    if (!formData.description.trim()) newErrors.description = "Описание обязательно";
    if (!Number.isInteger(formData.quantity) || formData.quantity < 0) {
      newErrors.quantity = "Количество должно быть целым неотрицательным числом";
    }
    if (formData.price <= 0) newErrors.price = "Цена должна быть больше 0";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Название товара"
        value={formData.name}
        onChange={(e) => handleChange("name", e.target.value)}
        error={errors.name}
        required
        disabled={isLoading}
      />

      <Textarea
        label="Описание"
        rows={3}
        value={formData.description}
        onChange={(e) => handleChange("description", e.target.value)}
        error={errors.description}
        required
        disabled={isLoading}
      />

      <Select
        label="Категория"
        options={categoryOptions}
        value={formData.category}
        onChange={(e) => handleChange("category", e.target.value)}
        disabled={isLoading}
      />

      <Input
        label="Количество"
        type="number"
        min={0}
        step={1}
        value={formData.quantity}
        onChange={(e) => handleChange("quantity", parseInt(e.target.value, 10) || 0)}
        error={errors.quantity}
        required
        disabled={isLoading}
      />

      <Input
        label="Цена (₽)"
        type="number"
        min={0}
        step={1}
        value={formData.price}
        onChange={(e) => handleChange("price", parseFloat(e.target.value) || 0)}
        error={errors.price}
        required
        disabled={isLoading}
      />

      <Input
        label="Изображение товара"
        type="file"
        accept="image/*"
        onChange={(e) => handleChange("image", e.target.files?.[0] || null)}
        disabled={isLoading}
      />

      <div className="flex justify-end pt-2">
        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? "Сохранение..." : submitLabel}
        </Button>
      </div>
    </form>
  );
};
