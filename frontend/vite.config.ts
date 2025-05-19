import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => ({
  base: "/", // Required for Vercel
  build: {
    outDir: "dist",
    emptyOutDir: true
  },
  server: mode === "development" ? {
    host: "::",
    port: 8080,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
    historyApiFallback: true,
  } : undefined,
  plugins: [react()], // Removed componentTagger
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));