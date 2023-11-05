import { defineConfig } from "cypress";

export default defineConfig({
  component: {
    devServer: {
      framework: "vue",
      bundler: "vite",
    },
    downloadsFolder: "test/cypress/downloads",
    fixturesFolder: "test/cypress/fixtures",
    integrationFolder: "test/cypress/integration",
    pluginsFile: "test/cypress/plugins/index.js",
    screenshotsFolder: "test/cypress/screenshots",
    supportFolder: "test/cypress/support",
    supportFile: "test/cypress/support/index.js",
    indexHtmlFile: "test/cypress/support/component-index.html",
    videosFolder: "test/cypress/videos",
    video: true,
  },
});
