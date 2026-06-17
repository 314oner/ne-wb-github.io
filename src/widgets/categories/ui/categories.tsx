// src/widgets/categories/ui/categories.tsx

import { fetchCategories, searchProducts, selectCategories, useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useState } from "react";

export const Categories: React.FC = () => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectCategories);
  //const results = useAppSelector(selectSearchResults);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [categories.length, dispatch]);

  useEffect(() => {
    if (categories.length > 0 && !selected) {
      setSelected(categories[0]);
    }
  }, [categories, selected]);

  const handleCategoryClick = (cat: string) => {
    setSelected(cat);
    if (cat === "All") {
      dispatch(searchProducts({ search: undefined, category: undefined }));
    } else {
      dispatch(searchProducts({ category: cat }));
    }
  };

  if (categories.length === 0) return null;

  return (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
      <h3 className="text-lg font-semibold mb-3">Фильтрация товаров</h3>
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => handleCategoryClick(cat)}
            className={`px-4 py-2 rounded-full text-sm transition-colors ${
              selected === cat ? "bg-green-600 text-white" : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            {cat} {selected === cat && "▼"}
          </button>
        ))}
      </div>
      {/*results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )*/}
    </div>
  );
};

export default Categories;