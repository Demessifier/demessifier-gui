import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import istanbul from "vite-plugin-istanbul";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    dts({ rollupTypes: true }),
    istanbul({ cypress: true, requireEnv: false }),
  ],
  build: {
    lib: {
      entry: "src/main.ts",
      formats: ["cjs", "es"],
      fileName: "main",
    },
    rollupOptions: {
      input: {
        index: "src/main.ts",
      },
      // What shouldn't be bundled into the library: peerDependencies, tests
      external: [
        "@fortawesome/fontawesome-svg-core",
        "@fortawesome/free-brands-svg-icons",
        "@fortawesome/free-regular-svg-icons",
        "@fortawesome/free-solid-svg-icons",
        "@fortawesome/vue-fontawesome",
        "@vueuse/core",
        "pinia",
        "vue",
        "vue-router",
        "/dev",
        "/test",
        /\.test\.ts$/,
        /\.cy\.ts$/,
      ],

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
