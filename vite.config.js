import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import Icons from "unplugin-icons/vite";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/MarioEditor/",
  plugins: [
    vue(),
    Icons({
      // experimental
      autoInstall: false,
      compiler: "vue3",
    }),
  ],
  server: {
    port: 3030,
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/assets/variables.scss";`,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
