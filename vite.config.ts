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
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Vendor splits
          if (id.includes('node_modules')) {
            if (id.match(/node_modules\/(react|react-dom|react-router-dom|scheduler)\//)) return 'vendor-react';
            if (id.includes('@radix-ui')) return 'vendor-radix';
            if (id.includes('recharts') || id.includes('/d3-')) return 'vendor-charts';
            if (id.includes('framer-motion')) return 'vendor-motion';
            if (id.includes('@tanstack')) return 'vendor-query';
            if (id.includes('@supabase')) return 'vendor-supabase';
            if (id.includes('lucide-react')) return 'vendor-icons';
            if (id.includes('date-fns')) return 'vendor-date';
            if (id.includes('embla-carousel')) return 'vendor-embla';
            if (id.includes('react-hook-form') || id.includes('/zod/') || id.includes('@hookform')) return 'vendor-forms';
            return 'vendor';
          }

          // Domain splits (src/)
          if (id.includes('/src/pages/admin/') || id.includes('/src/components/admin/')) return 'domain-admin';
          if (id.includes('/src/pages/aluna/') || id.includes('/src/components/aluna/')) return 'domain-aluna';
          if (id.includes('/src/pages/cliente/') || id.includes('/src/components/cliente/')) return 'domain-cliente';
          if (id.includes('/src/pages/terapeuta/') || id.includes('/src/components/terapeuta/') || id.includes('/casa-maquinas/')) return 'domain-terapeuta';
          if (id.includes('/src/pages/clube/') || id.includes('/src/components/clube/')) return 'domain-clube';
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
}));
