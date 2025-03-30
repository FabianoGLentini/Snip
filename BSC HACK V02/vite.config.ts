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
  proxy: {
    '/api': {
      target: 'http://localhost:3000', // Backend server URL
      changeOrigin: true,
      secure: false, // Set to `true` if the backend uses HTTPS
      rewrite: (path) => path.replace(/^\/api/, ''), // Removes "/api" prefix before forwarding
    },
  },
}));
