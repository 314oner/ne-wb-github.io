// src/views/create-product/index.tsx

import { ProductCreateForm } from "@/features/product-create/ui/product-create-form";

export const CreateProductPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <ProductCreateForm />
    </div>
  );
};

export default CreateProductPage;
