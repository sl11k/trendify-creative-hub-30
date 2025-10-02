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
      targets: ['defaults', 'safari >= 11', 'ios >= 11', 'not IE 11'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
      renderLegacyChunks: true,
      modernPolyfills: true,
      polyfills: [
        'es.promise',
        'es.promise.finally',
        'es.array.iterator',
        'es.object.assign',
        'es.object.entries',
        'es.object.values',
        'es.array.flat',
        'es.array.flat-map',
        'es.array.from',
        'es.array.find',
        'es.array.find-index',
        'es.string.includes',
        'es.string.starts-with',
        'es.string.ends-with',
        'es.array.includes',
        'es.symbol',
        'es.symbol.iterator',
        'es.map',
        'es.set',
        'es.weak-map',
        'es.weak-set',
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
    target: ['es2020', 'safari14', 'ios14'], // iOS 26 requires modern target
    minify: 'terser',
    sourcemap: false, // Disable for iOS performance
    cssTarget: 'safari14',
    cssMinify: true,
    terserOptions: {
      safari10: true,
      compress: {
        drop_console: true, // Remove console for iOS
        passes: 3,
        dead_code: true,
        drop_debugger: true,
        unsafe_arrows: false, // iOS 26 Safari fix
        unsafe_methods: false,
      },
      format: {
        safari10: true,
        comments: false,
      },
      mangle: {
        safari10: true,
      }
    },
    rollupOptions: {
      output: {
        manualChunks: undefined,
        format: 'es',
        inlineDynamicImports: true,
        // iOS 26 Safari compatibility
        generatedCode: {
          constBindings: true,
          arrowFunctions: true,
        }
      }
    },
    chunkSizeWarningLimit: 1500,
  },
}));
