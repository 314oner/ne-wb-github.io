// src/features/auction-form/ui/auction-form.tsx

import { Button, FileInput, Input, Textarea } from "@/shared/ui";
import React, { useState } from "react";

export interface AuctionFormData {
  itemName: string;
  description: string;
  startingBid: number;
  bidStart: string;
  bidEnd: string;
  image?: File | null;
}

export interface AuctionFormProps {
  initialData?: Partial<AuctionFormData>;
  onSubmit: (data: AuctionFormData) => Promise<void>;
  submitLabel: string;
  isLoading?: boolean;
}

const getLocalDateTimeString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const AuctionForm: React.FC<AuctionFormProps> = ({ initialData = {}, onSubmit, submitLabel, isLoading = false }) => {
  const now = new Date();
  const defaultStart = getLocalDateTimeString(now);
  const defaultEnd = getLocalDateTimeString(new Date(now.getTime() + 3600000));

  const [formData, setFormData] = useState<AuctionFormData>({
    itemName: initialData.itemName || "",
    description: initialData.description || "",
    startingBid: initialData.startingBid ?? 0,
    bidStart: initialData.bidStart || defaultStart,
    bidEnd: initialData.bidEnd || defaultEnd,
    image: null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof AuctionFormData, value: string | number | File | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.itemName.trim()) {
      newErrors.itemName = "Название лота обязательно";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Описание обязательно";
    }
    if (formData.startingBid <= 0) {
      newErrors.startingBid = "Начальная ставка должна быть больше 0";
    }
    if (!formData.bidStart) {
      newErrors.bidStart = "Укажите время начала аукциона";
    }
    if (!formData.bidEnd) {
      newErrors.bidEnd = "Укажите время окончания аукциона";
    }
    if (formData.bidStart && formData.bidEnd) {
      const start = new Date(formData.bidStart);
      const end = new Date(formData.bidEnd);
      if (end <= start) {
        newErrors.bidEnd = "Время окончания должно быть позже времени начала";
      }
    }

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
        label="Название лота"
        value={formData.itemName}
        onChange={(e) => handleChange("itemName", e.target.value)}
        error={errors.itemName}
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

      <Input
        label="Начальная ставка (₽)"
        type="number"
        min={0}
        step={1}
        value={formData.startingBid}
        onChange={(e) => handleChange("startingBid", parseFloat(e.target.value) || 0)}
        error={errors.startingBid}
        required
        disabled={isLoading}
      />

      <Input
        label="Время начала аукциона"
        type="datetime-local"
        value={formData.bidStart}
        onChange={(e) => handleChange("bidStart", e.target.value)}
        error={errors.bidStart}
        required
        disabled={isLoading}
      />

      <Input
        label="Время окончания аукциона"
        type="datetime-local"
        value={formData.bidEnd}
        onChange={(e) => handleChange("bidEnd", e.target.value)}
        error={errors.bidEnd}
        required
        disabled={isLoading}
      />

      <FileInput label="Изображение аукциона" onFileChange={(file) => handleChange("image", file)} disabled={isLoading} accept="image/*" />

      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? "Сохранение..." : submitLabel}
        </Button>
      </div>
    </form>
  );
};
