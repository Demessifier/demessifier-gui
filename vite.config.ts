import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), dts({ rollupTypes: true })],
  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["cjs", "es"],
      fileName: "index",
    },
    rollupOptions: {
      input: {
        index: "src/index.ts",
      },
      // What shouldn't be bundled into the library: dependencies, tests
      external: ["vue", "@vueuse/core", /\.test\.ts$/, /\.cy\.ts$/, "/test"],
      output: {
        globals: {
          vue: "Vue",
        },
      },
    },
    sourcemap: true,
    emptyOutDir: true,
    outDir: "build",
    // Reduce bloat from legacy polyfills.
    target: "ESNext",
    // Leave minification up to applications.
    minify: false,
  },
  css: {
    preprocessorOptions: {
      scss: {
        charset: false,
      },
    },
  },
});
