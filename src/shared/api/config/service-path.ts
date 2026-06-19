//src/config/servicePath.ts
export const API_URL = import.meta.env.DEV ? "" : import.meta.env.VITE_BACKEND_URL || "";
//export const API_URL = import.meta.env.DEV ? "" : "https://nest-proto-hub-backend-dev-9.vercel.app";
