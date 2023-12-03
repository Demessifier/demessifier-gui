import { createApp } from "vue";
import App from "./App.vue";
import { faIconInit } from "./provider/fa-icon";
import "./css/default-css-variables.css";
import "./css/global.css";
import "./css/table.css";
import "./css/form.css";

const app = createApp(App);
faIconInit();

app.mount("#app");
