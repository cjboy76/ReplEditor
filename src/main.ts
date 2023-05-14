import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import { Splitpanes, Pane } from "splitpanes";
import { VueModeInjectProvide } from "./store/globalStatus";
import "splitpanes/dist/splitpanes.css";
import "@/assets/main.css";
import "./utils/userWorker";

createApp(App)
  .use(createPinia())
  .provide("vueMode", VueModeInjectProvide)
  .component("Splitpanes", Splitpanes)
  .component("Pane", Pane)
  .mount("#app");
