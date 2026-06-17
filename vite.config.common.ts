import path from "path";
import type { UserConfig } from "vite";

function getBase(): string {
  if (process.env.BASE_URL) {
    return process.env.BASE_URL;
  }

  if (process.env.GITHUB_REPOSITORY) {
    const repoName = process.env.GITHUB_REPOSITORY.split("/")[1];
    return `/${repoName}/`;
  }

  return "/";
}
export const commonConfig: UserConfig = {
  base: getBase(),
  publicDir: "public",
  define: {
    global: "window",
    __DEV__: process.env.NODE_ENV !== "production",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom"],
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-dom/client", "react/jsx-runtime"],
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
      target: "es2022",
    },
  },
  server: {
    watch: {
      usePolling: false,
      ignored: ["**/node_modules/**", "**/dist/**"],
    },
    hmr: {
      overlay: true,
    },
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
      },
    },
  },
};
