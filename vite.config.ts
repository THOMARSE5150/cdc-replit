import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import postcssConfig from "./postcss.config.js";

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: postcssConfig, // ✅ Explicit postcss config
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  root: path.resolve(__dirname, "client"),
  publicDir: path.resolve(__dirname, "public"),
  build: {
    outDir: path.resolve(__dirname, "dist/client"),
    emptyOutDir: false, // ✅ Prevents wiping dist/server
  },
});