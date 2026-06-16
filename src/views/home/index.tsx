// src/views/home/index.tsx

import { Categories } from "@/widgets/categories/ui/categories";
import { Search } from "@/widgets/search/ui/search";
import { Suggestions } from "@/widgets/suggestions/ui/suggestions";
import { useEffect } from "react";

export const HomePage: React.FC = (): JSX.Element => {
  useEffect(() => {
    document.title = "Главная | Маркетплейс";
    return () => {
      document.title = "Маркетплейс";
    };
  }, []);

  return (
    <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <h1 className="sr-only">Главная страница маркетплейса</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Левая колонка: поиск и категории */}
        <section className="lg:col-span-2 space-y-6" aria-labelledby="search-categories-heading">
          <h2 id="search-categories-heading" className="sr-only">
            Поиск и категории товаров
          </h2>
          <Categories />
          <Search />
        </section>

        {/* Правая колонка: рекомендации */}
        <section className="lg:col-span-1" aria-labelledby="suggestions-heading">
          <Suggestions title="Новинки" />
        </section>
      </div>
    </main>
  );
};

export default HomePage;
