import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import Icons from 'unplugin-icons/vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/ReplEditor/',
  plugins: [
    vue(),

    Icons({
      // experimental
      autoInstall: false,
      compiler: 'vue3',
    }),

    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png'],
      workbox: {
        cleanupOutdatedCaches: true,
        globPatterns: ['**/*.{js,css,html,png}'],
      },
      devOptions: {
        enabled: true,
      },
      manifest: {
        id: 'ReplEditor',
        name: 'ReplEditor',
        short_name: 'ReplEditor',
        description: 'My Cute ReplEditor',
        theme_color: '#111',
        display: 'standalone',
        start_url: '/ReplEditor/',
        scope: '/ReplEditor/',
        icons: [
          {
            src: '/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/assets/variables.scss";`,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@vue/compiler-sfc': '@vue/compiler-sfc/dist/compiler-sfc.esm-browser.js',
    },
  },
});
