import { defineConfig } from "cypress";
import coverageTask from "@cypress/code-coverage/task";
import useBabelRc from "@cypress/code-coverage/use-babelrc";

export default defineConfig({
  component: {
    devServer: {
      framework: "vue",
      bundler: "vite",
    },
    setupNodeEvents(on, config) {
      // setupNodeEvents can be defined in either
      // the e2e or component configuration
      // on("task", registerCodeCoverageTasks);
      coverageTask(on, config);

      //   // tell Cypress to use .babelrc file
      //   // and instrument the specs files
      //   // only the extra application files will be instrumented
      //   // not the spec files themselves
        on('file:preprocessor', useBabelRc)
      //   // include any other plugin code...

      // It's IMPORTANT to return the config object
      // with any changed environment variables
      return config;
    },
    downloadsFolder: "test/cypress/downloads",
    fixturesFolder: "test/cypress/fixtures",
    screenshotsFolder: "test/cypress/screenshots",
    supportFolder: "test/cypress/support",
    supportFile: "test/cypress/support/component.ts",
    indexHtmlFile: "test/cypress/support/component-index.html",
    videosFolder: "test/cypress/videos",
    video: true,
  },
  env: {
    codeCoverageTasksRegistered: true,
    coverage: {
      reportAfterEachSpec: "lcov",
    },
  },
});
