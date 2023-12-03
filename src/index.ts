import { createApp } from "vue";
import App from "./App.vue";
import { faIconInit } from "./provider/fa-icon";
import FontAwesomeIcon from "./component/FontAwesomeIcon.vue";
import "./css/default-css-variables.css";
import "./css/global.css";
import "./css/table.css";
import "./css/form.css";
import { router } from "./provider/router";

export { FontAwesomeIcon }; // Removing this breaks vite building

const app = createApp(App);
app.use(router);
faIconInit();

router.isReady().then(() => {
  app.mount("#app");
});
