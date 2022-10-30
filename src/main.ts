import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import { Splitpanes, Pane } from 'splitpanes';
import { vueMode, setVueMode } from './store/globalStatus';
import 'splitpanes/dist/splitpanes.css';
import '@/assets/main.css';

createApp(App)
  .use(createPinia())
  .provide('vueMode', { vueMode, setVueMode })
  .component('Splitpanes', Splitpanes)
  .component('Pane', Pane)
  .mount('#app');
