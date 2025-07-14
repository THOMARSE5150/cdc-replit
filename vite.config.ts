import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import postcssConfig from "./postcss.config.cjs"; // ✅ Import the postcss config explicitly

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: postcssConfig, // ✅ Add the postcss config here
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  publicDir: path.resolve(import.meta.dirname, "public"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true,
  },
});