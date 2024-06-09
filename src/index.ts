import { createApp } from "vue";
import { createPinia } from "pinia";
import { type Router } from "vue-router";
import "./css/default-css-variables.css";
import "./css/global.css";
import "./css/table.css";
import "./css/form.css";
import { getRouterForMenu } from "./provider/router";
import { menuExample } from "./provider/menu";
import type { MenuItemAny } from "./provider/menu";

import {
  ButtonWithIcon,
  ButtonWithIconLink,
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
import { DEVELOPMENT } from "./provider/development-environment";
import { LogoSection, headerLogoExample } from "./model/logo-section";

export {
  ButtonWithIcon,
  ButtonWithIconLink,
  ColorSchemeSwitch,
  ColorPalette,
  StatusBox,
  model,
  provider,
};

const routerExample = getRouterForMenu(menuExample);

export const pinia = createPinia();

export function mountApp(
  targetElementSelector: HtmlElementSelector = { element: document.body },
  router: Router = routerExample,
  menu: MenuItemAny[] = menuExample,
  appPlugins: any[] = [],
  headerLogoProps: LogoSection[] = headerLogoExample,
): ReturnType<typeof createApp> {
  const mountToElement = getElementBySelector(targetElementSelector);
  const app = createApp(App, { mainHeaderLogo: headerLogoProps, menu: menu });
  app.use(pinia);
  app.use(router);
  for (const plugin of appPlugins) {
    app.use(plugin);
  }
  router.isReady().then(() => {
    app.mount(mountToElement);
  });
  return app;
}

if (DEVELOPMENT) {
  const app = mountApp({ elementId: "app" });
}
