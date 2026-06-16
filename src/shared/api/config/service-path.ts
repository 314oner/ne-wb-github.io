//src/config/servicePath.ts
export const API_URL = import.meta.env.DEV ? "" : import.meta.env.VITE_BACKEND_URL || "";
