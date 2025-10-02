import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import legacy from "@vitejs/plugin-legacy";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    legacy({
      targets: ['defaults', 'safari >= 11', 'ios >= 11'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
      renderLegacyChunks: true,
      polyfills: [
        'es.promise',
        'es.array.iterator',
        'es.object.assign',
        'es.array.flat',
        'es.array.flat-map',
        'es.string.includes',
        'es.array.includes',
      ]
    }),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: 'es2015',
    minify: 'terser',
    sourcemap: true,
    cssTarget: 'safari11',
    rollupOptions: {
      output: {
        manualChunks: undefined,
      }
    }
  },
}));
