import { createApp } from "vue";
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

const app = createApp(App);
app.use(routerExample);

routerExample.isReady().then(() => {
  app.mount("#app");
});
