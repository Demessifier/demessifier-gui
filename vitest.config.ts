import { defineConfig } from "vitest/config";
import { mergeConfig } from "vite";
import viteConfig from "./client/vite.config";

// https://vitest.dev/config/

const customization = {
  test: {
    coverage: {
      reportsDirectory: "./test/vitest/coverage",
    },
    //environment: "jsdom", // to have HTML "document" object in tests
  },
};

export default mergeConfig(viteConfig, defineConfig(customization));
