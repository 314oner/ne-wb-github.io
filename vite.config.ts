import react from "@vitejs/plugin-react-swc";
import { defineConfig, mergeConfig } from "vite";
import { commonConfig } from "./vite.config.common";

const mockPwaPlugin = () => ({
  name: "mock-pwa-register",
  resolveId(id: string) {
    if (id === "virtual:pwa-register") return id;
    return null;
  },
  load(id: string) {
    if (id === "virtual:pwa-register") {
      return `export const registerSW = () => ({
        onNeedRefresh: () => {},
        onOfflineReady: () => {},
      });`;
    }
    return null;
  },
});

export default defineConfig(() => {
  return mergeConfig(commonConfig, {
    plugins: [react({ devTarget: "es2022", tsDecorators: false }), mockPwaPlugin()],
    server: {
      port: 5173,
      open: false,
      hmr: { overlay: true },
      proxy: {
        "/nestApi": {
          target: "http://localhost:8081",
          changeOrigin: true,
          secure: false,
        },
      },
    },
    build: {
      minify: false,
      sourcemap: true,
      target: "esnext",
    },
  });
});
