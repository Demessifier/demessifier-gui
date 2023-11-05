import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: "build",
    target: "esnext",
  },
  css: {
    preprocessorOptions: {
      scss: {
        charset: false,
      },
    },
  },
});
