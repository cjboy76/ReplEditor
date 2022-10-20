import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

const defaultMainFile = 'App.vue';
const activeFile = ref(defaultMainFile);

const vueRuntimeURL = ref(
  'https://unpkg.com/@vue/runtime-dom@3.2.8/dist/runtime-dom.esm-browser.js'
);

const currentRuntimeVersion = computed(() => {
  return vueRuntimeURL.value.match(/[1-9]\d*(\.[1-9]\d*)*/gi)[0];
});

function updateRuntime(code) {
  vueRuntimeURL.value = code;
}
const useFileStore = defineStore('FILE_STORE', {
  state: () => {
    return {
      files: {},
      eval: {},
    };
  },
  actions: {
    addFile(fileName) {
      const newFile = createFile(fileName);
      this.files[fileName] = newFile;
    },

    updateFile(code, fileName) {
      if (!this.files[fileName]) {
        this.files[fileName] = createFile(fileName, code);
      } else {
        this.files[fileName].code = code;
      }
    },

    removeFile(fileName) {
      delete this.files[fileName];
    },

    updateCompiledFile(compiled, fileName) {
      this.files[fileName].compiled = compiled;
    },
  },
});

const useImportMap = defineStore('IMPORT_MAP', {
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
      }
    },
  },
});

function updateActiveFile(curActiveFile) {
  activeFile.value = curActiveFile;
}

function createFile(fileName, code = '') {
  return {
    fileName,
    code,
    compiled: {
      js: '',
      css: '',
      ssr: '',
    },
  };
}

export {
  defaultMainFile,
  activeFile,
  updateActiveFile,
  useFileStore,
  useImportMap,
  currentRuntimeVersion,
};
