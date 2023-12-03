import { createApp } from "vue";
import App from "./App.vue";
import { faIconInit } from "./provider/fa-icon";
import FontAwesomeIcon from "./component/FontAwesomeIcon.vue";
import "./css/default-css-variables.css";
import "./css/global.css";
import "./css/table.css";
import "./css/form.css";

export { FontAwesomeIcon }; // Removing this breaks vite building

const app = createApp(App);
faIconInit();

app.mount("#app");
