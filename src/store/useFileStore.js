import { defineStore } from "pinia";
import { computed, ref } from "vue";

const defaultMainFile = "App.vue";
const activeFile = ref(defaultMainFile);
const VueWelcomeCode = `<script setup>
import { ref } from 'vue'

const msg = ref('Hello Vue!')
</script>

<template>
  <h1>{{ msg }}</h1>
  <input v-model="msg">
</template>

<style>
  h1 {
    color: rebeccapurple
  }
</style>
`;

const vueRuntimeURL = ref(
  "https://unpkg.com/@vue/runtime-dom@3.2.8/dist/runtime-dom.esm-browser.js"
);

const currentRuntimeVersion = computed(() => {
  return vueRuntimeURL.value.match(/[1-9]\d*(\.[1-9]\d*)*/gi)[0];
});

function updateRuntime(code) {
  vueRuntimeURL.value = code;
}
const useFileStore = defineStore("FILE_STORE", {
  state: () => {
    return {
      files: {
        "App.vue": createFile(defaultMainFile, VueWelcomeCode),
      },
    };
  },
  actions: {
    addFile(fileName) {
      const newFile = createFile(fileName);
      this.files[fileName] = newFile;
    },

    updateFile(code, fileName) {
      this.files[fileName].code = code;
    },

    removeFile(fileName) {
      delete this.files[fileName];
    },

    updateCompiledFile(compiled, fileName) {
      this.files[fileName].compiled = compiled;
    },
  },
});

const useImportMap = defineStore("IMPORT_MAP", {
  state: () => {
    return {
      importMap: JSON.stringify(
        {
          imports: {
            vue: vueRuntimeURL.value,
          },
        },
        null,
        2
      ),
    };
  },
  actions: {
    updateImportMap(code) {
      this.importMap = code;
      let json = JSON.parse(code);
      if (json.imports.vue) {
        updateRuntime(json.imports.vue);
      } else {
        console.error("Please define Vue Runtime version.");
      }
    },
  },
});

function updateActiveFile(curActiveFile) {
  activeFile.value = curActiveFile;
}

function createFile(fileName, code = "") {
  return {
    fileName,
    code,
    compiled: {
      js: "",
      css: "",
      ssr: "",
    },
  };
}

const isDarkMode = ref(true);

function toggleTheme() {
  isDarkMode.value = !isDarkMode.value;
  if (isDarkMode.value) {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.setAttribute("data-theme", "light");
  }
}

export {
  defaultMainFile,
  activeFile,
  updateActiveFile,
  VueWelcomeCode,
  useFileStore,
  isDarkMode,
  toggleTheme,
  useImportMap,
  currentRuntimeVersion,
};
