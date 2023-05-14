import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import { VueModeInjectProvide } from "./store/globalStatus";
import "splitpanes/dist/splitpanes.css";
import "@/assets/main.css";
import "./utils/userWorker";

createApp(App)
  .use(createPinia())
  .provide("vueMode", VueModeInjectProvide)
  .mount("#app");
