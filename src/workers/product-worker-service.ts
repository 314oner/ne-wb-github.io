// src/workers/product-worker-service.ts
let worker: Worker | null = null;

function getWorker(): Worker {
  if (!worker) {
    // Vite обработает эту конструкцию и подставит правильный URL собранного воркера
    worker = new Worker(new URL("./productWorker.ts", import.meta.url), { type: "module" });
  }
  return worker;
}

export function generateProductsInWorker(count: number): Promise<any[]> {
  return new Promise((resolve) => {
    const w = getWorker();
    const handler = (e: MessageEvent) => {
      if (e.data.type === "GENERATE_PRODUCTS_RESULT") {
        w.removeEventListener("message", handler);
        resolve(e.data.products);
      }
    };
    w.addEventListener("message", handler);
    w.postMessage({ type: "GENERATE_PRODUCTS", payload: { count } });
  });
}
