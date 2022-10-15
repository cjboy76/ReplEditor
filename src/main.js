import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import { Splitpanes, Pane } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css';

createApp(App)
  .use(createPinia())
  .component('Splitpanes', Splitpanes)
  .component('Pane', Pane)
  .mount('#app');
