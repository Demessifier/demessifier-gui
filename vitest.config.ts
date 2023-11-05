import { defineConfig } from "vitest/config";
import { mergeConfig, UserConfig } from "vite";
import viteConfig from "./vite.config";

// https://vitest.dev/config/

const customization: UserConfig = {
  test: {
    coverage: {
      reportsDirectory: "./test/vitest/coverage",
    },
    //environment: "jsdom", // to have HTML "document" object in tests
  },
};

export default mergeConfig(viteConfig, defineConfig(customization));
