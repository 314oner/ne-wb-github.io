// src/features/shop-form/ui/shop-form.tsx

import { Button, FileInput, Input, Textarea } from "@/shared/ui";
import React, { useState } from "react";

export interface ShopFormData {
  name: string;
  description: string;
  image?: File | null;
}

export interface ShopFormProps {
  initialData?: Partial<ShopFormData>;
  onSubmit: (data: ShopFormData) => Promise<void>;
  submitLabel: string;
  isLoading?: boolean;
}

export const ShopForm: React.FC<ShopFormProps> = ({ initialData = {}, onSubmit, submitLabel, isLoading }) => {
  const [formData, setFormData] = useState<ShopFormData>({
    name: initialData.name || "",
    description: initialData.description || "",
    image: null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof ShopFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Shop name is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
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
      <Input label="Shop Name" value={formData.name} onChange={(e) => handleChange("name", e.target.value)} error={errors.name} required />
      <Textarea
        label="Description"
        rows={3}
        value={formData.description}
        onChange={(e: { target: { value: any } }) => handleChange("description", e.target.value)}
        error={errors.description}
        required
      />
      <FileInput label="Shop Logo" onFileChange={(file) => handleChange("image", file)} />
      <div className="flex justify-end">
        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
};
