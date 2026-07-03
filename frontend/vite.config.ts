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
      strategies: "injectManifest",
      srcDir: "src",
      filename: "sw.ts",
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
      injectManifest: {
        // App-Shell + zuletzt geladene Galerie-/Challenge-Daten cachen, damit
        // Kernfunktionen bei kurzzeitigem Netzwerkausfall im Camp nutzbar bleiben.
        // Die Cache-Regeln selbst stehen in src/sw.ts (injectManifest-Strategie,
        // damit dort zusätzlich push/notificationclick-Handler laufen können).
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
