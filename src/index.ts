import { createApp } from "vue";
import App from "./App.vue";
import { faIconInit } from "./provider/fa-icon";
import StatusBox from "./component/StatusBox.vue";
import FontAwesomeIcon from "./component/FontAwesomeIcon.vue";
import "./css/default-css-variables.css";
import "./css/global.css";
import "./css/table.css";
import "./css/form.css";

export { StatusBox, FontAwesomeIcon };

const app = createApp(App);
faIconInit();

app.mount("#app");
