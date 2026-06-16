import react from "@vitejs/plugin-react-swc";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig, mergeConfig } from "vite";
import bundleStatsMetrics from "vite-bundle-stats-metrics";
import compression from "vite-plugin-compression";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import { VitePWA } from "vite-plugin-pwa";
import { commonConfig } from "./vite.config.common";

export default defineConfig(() => {
  return mergeConfig(commonConfig, {
    plugins: [
      react({ tsDecorators: false }),

      VitePWA({
        registerType: "autoUpdate",
        includeAssets: ["favicon.ico", "apple-touch-icon.png"],
        manifest: {
          name: "ne-wb-github.io",
          short_name: "newb",
          description: "Тут можно избавиться от старых вещей и купить новые",
          theme_color: "#ffffff",
          background_color: "#ffffff",
          display: "standalone",
          icons: [
            {
              src: "web-app-manifest-192x192.png",
              sizes: "192x192",
              type: "image/png",
              purpose: "any maskable",
            },
            {
              src: "web-app-manifest-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any maskable",
            },
          ],
        },
        workbox: {
          globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2,webmanifest,json}"],
          runtimeCaching: [
            {
              urlPattern: ({ url }) => /\.(png|jpg|jpeg|webp|gif|svg)$/i.test(url.pathname),
              handler: "StaleWhileRevalidate",
              options: {
                cacheName: "images-cache",
                expiration: {
                  maxEntries: 60,
                  maxAgeSeconds: 30 * 24 * 60 * 60, // 30 дней
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: "StaleWhileRevalidate",
              options: {
                cacheName: "google-fonts",
              },
            },
            {
              urlPattern: ({ request }) => request.mode === "navigate",
              handler: "NetworkFirst",
              options: {
                cacheName: "pages-cache",
                networkTimeoutSeconds: 3,
              },
            },
          ],
        },
        devOptions: { enabled: false },
      }),

      ViteImageOptimizer({
        png: { quality: 80, compressionLevel: 9 },
        jpeg: { quality: 80, progressive: true },
        webp: { lossless: false, quality: 75 },
        avif: { quality: 65 },
        svg: { multipass: true, plugins: [] },
      }),

      compression({ algorithm: "brotliCompress", ext: ".br", threshold: 1024 }),
      compression({ algorithm: "gzip", ext: ".gz", threshold: 1024 }),

      bundleStatsMetrics({
        logToConsole: "detailed",
      }),

      visualizer({
        filename: "dist/stats.html",
        open: false,
        gzipSize: true,
        brotliSize: true,
      }),
    ],
    build: {
      target: "es2022",
      minify: "esbuild",
      chunkSizeWarningLimit: 600,
      cssCodeSplit: true,
      modulePreload: { polyfill: true },
    },
  });
});
