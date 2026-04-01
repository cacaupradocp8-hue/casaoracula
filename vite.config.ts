import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({ // rebuild-v2
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    VitePWA({
      // Importante: no construtor/preview (dev), não queremos Service Worker
      // porque ele pode “prender” o app em versões antigas por cache.
      devOptions: {
        enabled: false,
      },
      registerType: "autoUpdate",
      // Evita tela branca entre deploys quando um HTML antigo referencia chunks já expirados.
      // Mantemos o manifesto, mas o SW passa a se autodestruir e limpar caches legados.
      selfDestroying: true,
      includeAssets: [],
      manifest: {
        name: "Casa ORÁCULA",
        short_name: "ORÁCULA",
        description: "Formação simbólica para terapeutas e mentoras de mulheres",
        theme_color: "#0a0d14",
        background_color: "#0a0d14",
        display: "standalone",
        orientation: "portrait-primary",
        start_url: "/",
        scope: "/",
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        // Sem precache do HTML para não servir index antigo apontando para assets hashados removidos.
        globPatterns: [],
        cleanupOutdatedCaches: true,
        maximumFileSizeToCacheInBytes: 2 * 1024 * 1024,
        // Skip waiting immediately so new SW activates fast
        skipWaiting: true,
        clientsClaim: true,
        // No runtime caching - let browser handle it naturally
        runtimeCaching: [],
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime"],
  },
}));
