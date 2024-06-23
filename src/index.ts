import { createApp } from "vue";
import { createPinia } from "pinia";
import "./css/default-css-variables.css";
import "./css/global.css";
import "./css/table.css";
import "./css/form.css";
import { router } from "./provider/router";

import * as component from "./component";
import * as model from "./model";
import * as provider from "./provider";
import App from "./App.vue";

export { component, model, provider, App };

const app = createApp(App);
export const pinia = createPinia();
app.use(pinia);
app.use(router);

router.isReady().then(() => {
  app.mount("#app");
});
