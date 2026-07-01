import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.png", "branding/*.png"],
      manifest: {
        name: "Helmpflicht Hub",
        short_name: "Helmpflicht",
        description: "Camp Helmpflicht Festival Hub",
        theme_color: "#0D1419",
        background_color: "#0D1419",
        display: "standalone",
        start_url: "/",
        icons: [
          { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
        ],
      },
      workbox: {
        // App-Shell + zuletzt geladene Galerie-/Challenge-Daten cachen, damit
        // Kernfunktionen bei kurzzeitigem Netzwerkausfall im Camp nutzbar bleiben.
        runtimeCaching: [
          {
            urlPattern: /\/api\/(gallery|challenges|friendbook|leaderboards)/,
            handler: "StaleWhileRevalidate",
            options: { cacheName: "api-cache" },
          },
          {
            urlPattern: /\/(thumbnails|uploads)\//,
            handler: "CacheFirst",
            options: {
              cacheName: "media-cache",
              expiration: { maxEntries: 500 },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
    port: 5173,
    proxy: {
      "/api": "http://localhost:8000",
      "/uploads": "http://localhost:8000",
      "/thumbnails": "http://localhost:8000",
    },
  },
});
