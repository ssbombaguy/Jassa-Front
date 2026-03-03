// File: vite.config.js

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        // Global SCSS imports available in every module
        additionalData: `@import "./src/styles/_variables.scss";`,
      },
    },
  },
});
