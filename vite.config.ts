import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteCompression from "vite-plugin-compression";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr(), viteCompression()],
  build: {
    chunkSizeWarningLimit: 500000,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});
