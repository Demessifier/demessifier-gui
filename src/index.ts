import { createApp } from "vue";
import App from "./App.vue";
import StatusBox from "./component/StatusBox.vue";
import "./css/default-css-variables.css";
import "./css/global.css";
import "./css/table.css";
import "./css/form.css";
import { router } from "./provider/router";

export { StatusBox }; // Removing this breaks vite building

const app = createApp(App);
app.use(router);

router.isReady().then(() => {
  app.mount("#app");
});
