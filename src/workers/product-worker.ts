// store/workers/product-worker.ts

import type { Product, ProductId, ShopId } from "@/types";
import { fakerRU as faker } from "@faker-js/faker";

const MARKET_CATEGORIES = ["Электроника", "Смартфоны и гаджеты", "Компьютеры и ноутбуки", "Бытовая техника", "Одежда и обувь", "Книги"] as const;

type MarketCategory = (typeof MARKET_CATEGORIES)[number];

const categoryPriceRange: Partial<Record<MarketCategory, { min: number; max: number }>> = {
  Электроника: { min: 1000, max: 150000 },
  "Смартфоны и гаджеты": { min: 5000, max: 120000 },
  "Компьютеры и ноутбуки": { min: 15000, max: 250000 },
  "Бытовая техника": { min: 2000, max: 200000 },
  "Одежда и обувь": { min: 500, max: 30000 },
  Книги: { min: 200, max: 5000 },
};
const DEFAULT_PRICE_RANGE = { min: 500, max: 150000 };
const getPriceForCategory = (category: MarketCategory): number => {
  const range = categoryPriceRange[category] ?? DEFAULT_PRICE_RANGE;
  return faker.number.int({ min: range.min, max: range.max });
};

const categoryBaseNames: Partial<Record<MarketCategory, string[]>> = {
  Электроника: ["смарт-часы", "ноутбук", "планшет", "монитор", "клавиатура", "мышь", "наушники", "зарядное устройство"],
  "Смартфоны и гаджеты": ["смартфон", "фитнес-браслет", "умная колонка", "портативный аккумулятор", "дрон"],
  "Компьютеры и ноутбуки": ["игровой ноутбук", "ультрабук", "моноблок", "системный блок", "видеокарта", "процессор"],
  "Бытовая техника": ["холодильник", "стиральная машина", "пылесос", "микроволновая печь", "электрочайник", "кофеварка"],
  "Одежда и обувь": ["футболка", "джинсы", "куртка", "кроссовки", "платье", "свитер", "брюки"],
  Книги: ["роман", "детектив", "фантастика", "учебник", "энциклопедия", "комикс"],
};
const getProductNameByCategory = (category: MarketCategory): string => {
  const words = categoryBaseNames[category];
  if (words && words.length > 0) {
    const base = faker.helpers.arrayElement(words);
    return base.charAt(0).toUpperCase() + base.slice(1).toLowerCase();
  }
  return faker.commerce.productName();
};

const categoryDescriptions: Partial<Record<MarketCategory, string[]>> = {
  Электроника: ["отличное качество сборки", "долгий срок службы", "энергоэффективность", "современный дизайн"],
  "Смартфоны и гаджеты": ["быстрый процессор", "ёмкий аккумулятор", "отличная камера", "поддержка 5G"],
  "Компьютеры и ноутбуки": ["высокая производительность", "надёжная система охлаждения", "компактный размер"],
  "Бытовая техника": ["экономит электроэнергию", "проста в использовании", "многофункциональность"],
  "Одежда и обувь": ["натуральные материалы", "удобная посадка", "современный покрой"],
  Книги: ["увлекательный сюжет", "твёрдый переплёт", "бестселлер"],
};
const getProductDescription = (category: MarketCategory): string => {
  const specific = categoryDescriptions[category];
  let quality = "";
  if (specific && specific.length > 0) {
    quality = faker.helpers.arrayElement(specific);
  } else {
    quality = faker.helpers.arrayElement(["высокое качество", "доступная цена", "стильный внешний вид", "надёжность"]);
  }
  const additional = faker.helpers.arrayElement([
    "Идеальный выбор для повседневного использования.",
    "Рекомендуем к покупке.",
    "Сочетает в себе функциональность и эстетику.",
    "Проверено временем.",
    "Отличное соотношение цены и качества.",
  ]);
  return `Качественный товар из категории "${category}". Отличается ${quality.toLowerCase()}. ${additional}`;
};

//генерация изображений
const getHashCode = (str: string): number => {
  const m = 2147483647;
  const a = 1103515245;
  const c = 12345;
  let state = 0;
  for (let i = 0; i < str.length; i++) {
    state = (a * state + c + str.charCodeAt(i)) % m;
  }
  return Math.floor((state / m) * 1000);
};

/*
function assertBrowser(): void {
  if (typeof window === "undefined") {
    throw new Error("generateProductImage32 can only be used in browser environment");
  }
}
*/

const symbolCache = new Map<MarketCategory, string>();
const getCategorySymbol = (category: MarketCategory): string => {
  if (symbolCache.has(category)) return symbolCache.get(category)!;
  const cx = 300,
    cy = 200;
  const stroke = "white";
  const opacity = 0.7;
  let svg = "";
  if (/электрон|компьютер|телефон|гаджет/i.test(category)) {
    svg = `<circle cx="${cx}" cy="${cy}" r="60" fill="none" stroke="${stroke}" stroke-width="4" stroke-opacity="${opacity}" />
            <line x1="${cx - 45}" y1="${cy}" x2="${cx + 45}" y2="${cy}" stroke="${stroke}" stroke-width="3" stroke-opacity="${opacity}" />
            <line x1="${cx}" y1="${cy - 45}" x2="${cx}" y2="${cy + 45}" stroke="${stroke}" stroke-width="3" stroke-opacity="${opacity}" />`;
  } else if (/одежд|обув|аксессуар|бижутери/i.test(category)) {
    svg = `<path d="M ${cx - 80} ${cy} Q ${cx - 40} ${cy - 40} ${cx} ${cy} T ${cx + 80} ${cy}" fill="none" stroke="${stroke}" stroke-width="5" stroke-opacity="${opacity}" />
            <path d="M ${cx - 80} ${cy + 20} Q ${cx - 40} ${cy - 20} ${cx} ${cy + 20} T ${cx + 80} ${cy + 20}" fill="none" stroke="${stroke}" stroke-width="3" stroke-opacity="0.4" />`;
  } else if (/дом|кухн|мебель|уют/i.test(category)) {
    svg = `<polygon points="${cx - 50},${cy + 30} ${cx},${cy - 40} ${cx + 50},${cy + 30}" fill="none" stroke="${stroke}" stroke-width="5" stroke-opacity="${opacity}" />
            <rect x="${cx - 30}" y="${cy + 30}" width="60" height="50" fill="none" stroke="${stroke}" stroke-width="3" stroke-opacity="${opacity}" />`;
  } else if (/книг|канцеляр|хобби/i.test(category)) {
    svg = `<rect x="${cx - 45}" y="${cy - 35}" width="90" height="70" rx="5" fill="none" stroke="${stroke}" stroke-width="4" stroke-opacity="${opacity}" />
            <line x1="${cx}" y1="${cy - 35}" x2="${cx}" y2="${cy + 35}" stroke="${stroke}" stroke-width="2" stroke-opacity="${opacity}" />`;
  } else {
    svg = `<circle cx="${cx}" cy="${cy}" r="55" fill="none" stroke="${stroke}" stroke-width="4" stroke-opacity="${opacity}" />
            <circle cx="${cx}" cy="${cy}" r="8" fill="${stroke}" fill-opacity="${opacity}" />`;
  }
  symbolCache.set(category, svg);
  return svg;
};
const DOT_PATTERN = `<pattern id="global-dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1.5" fill="white" fill-opacity="0.25" /></pattern><rect width="600" height="400" fill="url(#global-dots)" />`;
const imageCache = new Map<string, string>();
export const generateProductImage32 = (category: MarketCategory, seedId: string): string => {
  //assertBrowser();
  const cacheKey = `${category}|${seedId}`;
  if (imageCache.has(cacheKey)) return imageCache.get(cacheKey)!;
  const idHash = getHashCode(seedId);
  const color1 = `hsl(${idHash % 360}, 70%, 55%)`;
  const color2 = `hsl(${(idHash + 120) % 360}, 65%, 35%)`;
  const symbol = getCategorySymbol(category);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><defs><linearGradient id="grad-${seedId}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${color1}" /><stop offset="100%" stop-color="${color2}" /></linearGradient></defs><rect width="600" height="400" fill="url(#grad-${seedId})" />${DOT_PATTERN}${symbol}</svg>`;
  const dataURL = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  imageCache.set(cacheKey, dataURL);
  return dataURL;
};

//создание одного продукта
const createProductForCategory = (category: MarketCategory): Product => {
  const _id = faker.database.mongodbObjectId() as ProductId;
  const image = generateProductImage32(category, _id);
  const productName = getProductNameByCategory(category);
  const description = getProductDescription(category);
  const price = getPriceForCategory(category);
  //90% вероятность попасть в магазин "s1"
  const isS1Shop = Math.random() < 0.9;
  const shop: Product["shop"] = isS1Shop
    ? { _id: "s1" as ShopId, name: "Antique Store" }
    : { _id: faker.database.mongodbObjectId() as ShopId, name: `Маркет ${faker.company.name()}` };
  return {
    _id,
    name: productName,
    price,
    image,
    shop,
    created: faker.date.recent({ days: 90 }).toISOString(),
    quantity: faker.number.int({ min: 0, max: 100 }),
    description,
    category,
  };
};

//генерация продуктов
const generateProducts = <TCount extends number>(count: TCount): Product[] => {
  const categoriesList = [...MARKET_CATEGORIES];
  const minPerCategory = Math.max(1, Math.floor(count / categoriesList.length));
  const remainingSlots = count - minPerCategory * categoriesList.length;

  const products: Product[] = [];

  for (const category of categoriesList) {
    for (let i = 0; i < minPerCategory; i++) {
      products.push(createProductForCategory(category));
    }
  }

  //остаток
  for (let i = 0; i < remainingSlots; i++) {
    const category = faker.helpers.arrayElement(categoriesList) as MarketCategory;
    products.push(createProductForCategory(category));
  }

  return faker.helpers.shuffle(products);
};

export const mockProducts = generateProducts(10); // N продуктов
export const mockLatestProducts: Product[] = [...mockProducts]
  .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
  .slice(0, 50); // 50 новинок
export const mockCategories: readonly string[] = [
  "All",
  ...new Set(mockProducts.map((p) => p.category).filter((c): c is string => Boolean(c))),
] as const;

export const mockShopProducts: Product[] = mockProducts.filter((p) => p.shop._id === ("s1" as ShopId));

const firstCategory = mockProducts[0]?.category;
export const mockRelatedProducts: Product[] = firstCategory
  ? mockProducts.filter((p) => p.category === firstCategory && p._id !== mockProducts[0]?._id).slice(0, 8)
  : [];

export const isValidProduct = (product: unknown): product is Product => {
  return !!product && typeof product === "object" && "_id" in product && "name" in product;
};

export const filterProducts = <T extends { search?: string; category?: string }>(products: Product[], filters: T): Product[] => {
  let result = products;
  if (filters.category && filters.category !== "All") {
    result = result.filter((p) => p.category === filters.category);
  }
  if (filters.search) {
    const lowerSearch = filters.search.toLowerCase();
    result = result.filter((p) => p.name.toLowerCase().includes(lowerSearch));
  }
  return result;
};

self.onmessage = (e: MessageEvent) => {
  const { type, payload } = e.data;
  if (type === "GENERATE_PRODUCTS") {
    const count = payload?.count ?? 10;
    const products = generateProducts(count);
    self.postMessage({ type: "GENERATE_PRODUCTS_RESULT", products });
  }
};
