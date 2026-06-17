// src/views/home/index.tsx

import React, { lazy, Suspense, useEffect } from "react";

const Categories = lazy(() => import("@/widgets/categories/ui/categories"));
const Search = lazy(() => import("@/widgets/search/ui/search"));
const Suggestions = lazy(() => import("@/widgets/suggestions/ui/suggestions"));

const WidgetFallback = () => (
  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow p-4 animate-pulse">
    <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-4"></div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
    </div>
  </div>
);

const HomePage: React.FC = () => {
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
          <Suspense fallback={<WidgetFallback />}>
            <Categories />
          </Suspense>
          <Suspense fallback={<WidgetFallback />}>
            <Search />
          </Suspense>
        </section>

        {/* Правая колонка: рекомендации */}
        <section className="lg:col-span-1" aria-labelledby="suggestions-heading">
          <Suspense fallback={<WidgetFallback />}>
            <Suggestions title="Новинки" />
          </Suspense>
        </section>
      </div>
    </main>
  );
};

export default HomePage;
