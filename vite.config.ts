import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "logo.jpg", "icon-192.jpg", "icon-512.jpg"],
      workbox: {
        navigateFallbackDenylist: [/^\/~oauth/],
        globPatterns: ["**/*.{js,css,html,ico,png,svg,jpg,jpeg,woff2}"],
      },
      manifest: {
        name: "AvyLink — Ton univers en un seul lien",
        short_name: "AvyLink",
        description: "Crée ta page de liens personnalisée. Centralise tes réseaux, tes produits et monétise ta présence en ligne.",
        theme_color: "#0EAAF0",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "/icon-192.jpg",
            sizes: "192x192",
            type: "image/jpeg",
            purpose: "any maskable",
          },
          {
            src: "/icon-512.jpg",
            sizes: "512x512",
            type: "image/jpeg",
            purpose: "any maskable",
          },
        ],
        categories: ["social", "productivity", "business"],
        lang: "fr",
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
