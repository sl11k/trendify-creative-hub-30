import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
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
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: ['es2015', 'safari11'],
    cssTarget: ['safari11'],
    minify: 'terser',
    terserOptions: {
      safari10: true,
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2015',
    },
  },
}));
