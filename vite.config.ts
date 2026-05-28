import devServer from "@hono/vite-dev-server"
import path from "path"
const __dirname = import.meta.dirname
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    devServer({ entry: "api/boot.ts", exclude: [/^\/(?!api\/).*$/] }),
    inspectAttr(), react()],
  server: {
    port: 3000,
    headers: {
      "Cross-Origin-Opener-Policy": "unsafe-none",
      "Cross-Origin-Embedder-Policy": "unsafe-none",
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@contracts": path.resolve(__dirname, "./contracts"),
      "@db": path.resolve(__dirname, "./db"),
      "db": path.resolve(__dirname, "./db"),
      "images": path.resolve(__dirname, "./public/images"),
    },
  },
  envDir: path.resolve(__dirname),
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
