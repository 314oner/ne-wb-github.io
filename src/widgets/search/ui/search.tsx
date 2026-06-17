// src/widgets/search/ui/search.tsx

import { ProductCard } from "@/entities/product/ui/product-card";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { searchProducts, selectCategories, selectSearched, selectSearchResults, useAppDispatch, useAppSelector } from "@/store";
import { useId, useState } from "react";

export const Search: React.FC = () => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectCategories);
  const results = useAppSelector(selectSearchResults);
  const searched = useAppSelector(selectSearched);

  const [category, setCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const categorySelectId = useId();

  const handleSearch = () => {
    dispatch(searchProducts({ search: searchTerm, category: category !== "All" ? category : undefined }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
      <div className="flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[150px]">
          <label htmlFor={categorySelectId} className="block text-sm font-medium mb-1">
            Категория
          </label>
          <select
            id={categorySelectId}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <Input
            label="Поиск"
            type="search"
            placeholder="Название товара..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <Button onClick={handleSearch}>🔍 Поиск</Button>
      </div>

      {searched && (
        <div className="mt-6">
          {results.length === 0 ? (
            <p className="text-center text-gray-500">Товары не найдены :(</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
