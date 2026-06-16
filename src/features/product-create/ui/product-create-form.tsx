// src/features/product-create/ui/product-create-form.tsx

import { ProductForm, type ProductFormData } from "@/features/product-form/ui/product-form";
import { createProduct, selectProductLoading, useAppDispatch, useAppSelector } from "@/store";
import type { CreateProductDto } from "@/types";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

export const ProductCreateForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { shopId } = useParams<{ shopId: string }>();
  const isLoading = useAppSelector(selectProductLoading);

  const handleSubmit = async (formData: ProductFormData) => {
    const productDto: CreateProductDto = {
      name: formData.name,
      description: formData.description,
      category: formData.category,
      quantity: formData.quantity,
      price: formData.price,
      image: formData.image ?? undefined,
    };

    try {
      await dispatch(createProduct(productDto)).unwrap();
      toast.success("Продукт успешно создан!");
      navigate(`/seller/shop/${shopId}/products`);
    } catch (_err) {
      toast.error("Не удалось создать продукт");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Создать новый продукт</h2>
      <ProductForm onSubmit={handleSubmit} submitLabel="Create Product" isLoading={isLoading} />
    </div>
  );
};
