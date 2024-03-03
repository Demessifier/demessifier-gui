import { Component, createApp } from "vue";
import { Router } from "vue-router";
import "./css/default-css-variables.css";
import "./css/global.css";
import "./css/table.css";
import "./css/form.css";
import { getRouterForMenu } from "./provider/router";
import { menuExample } from "./provider/menu-example";

import {
  ButtonWithIcon,
  ColorSchemeSwitch,
  ColorPalette,
  StatusBox,
} from "./component";
import * as model from "./model";
import * as provider from "./provider";
import App from "./App.vue";
import {
  getElementBySelector,
  HtmlElementSelector,
} from "./provider/html-element";

export {
  ButtonWithIcon,
  ColorSchemeSwitch,
  ColorPalette,
  StatusBox,
  model,
  provider,
  App,
};

const routerExample = getRouterForMenu(menuExample);

export function mountApp(
  rootAppComponent: Component = App,
  targetElementSelector: HtmlElementSelector = { element: document.body },
  router: Router = routerExample,
  appPlugins: any[] = [],
): ReturnType<typeof createApp> {
  const mountToElement = getElementBySelector(targetElementSelector);
  const app = createApp(rootAppComponent);
  app.use(router);
  for (const plugin of appPlugins) {
    app.use(plugin);
  }
  router.isReady().then(() => {
    app.mount(mountToElement);
  });
  return app;
}

// const app = mountApp(App, { elementId: "app" }, routerExample, []); // FOR TESTING ONLY
