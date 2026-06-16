// src/widgets/product-details/ui/product-details.tsx

import { AddToCart } from "@/features/cart/ui/add-to-cart";
import { Button } from "@/shared/ui";
import { Product } from "@/types";
import { Link } from "react-router-dom";

interface ProductDetailsProps {
  product: Product;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const { name, description, price, quantity, image, shop, created } = product;
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="md:flex">
        <div className="md:w-1/2">
          <img src={image} alt={name} className="w-full h-full object-cover" />
        </div>
        <div className="p-6 md:w-1/2">
          <h1 className="text-3xl font-bold mb-2">{name}</h1>
          <p className="text-gray-500 mb-4">{quantity > 0 ? "В наличии" : "Нет в наличии"}</p>
          <p className="text-gray-700 mb-4">{description}</p>
          <p className="text-2xl font-bold text-wcag-green mb-4">₽{price}</p>
          <Link to={`/shops/${shop._id}`} className="text-sm text-gray-500 hover:text-wcag-green inline-block mb-4">
            🛒 {shop.name}
          </Link>
          <div className="flex gap-3">
            <AddToCart product={product} shopId={shop._id} />
            <Link to="/">
              <Button variant="outline">Продолжить покупки</Button>
            </Link>
          </div>
          <p className="text-xs text-gray-400 mt-4">Добавлено {new Date(created).toDateString()}</p>
        </div>
      </div>
    </div>
  );
};
