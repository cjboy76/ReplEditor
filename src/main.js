import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import { registerSW } from 'virtual:pwa-register';

if ('serviceWorker' in navigator) {
  // && !/localhost/.test(window.location)) {
  registerSW();
}

createApp(App).use(createPinia()).mount('#app');
