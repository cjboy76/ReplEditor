import { defineStore } from 'pinia';
import { ref } from 'vue';
import { defaultHtml, defaultCss, defaultJavascript } from './globalStatus';
import type { File, FileName, Files } from '../types';

const defaultMainFile = 'App.vue';
const activeFile = ref(defaultMainFile);

const vueRuntimeURL = ref(
  'https://unpkg.com/@vue/runtime-dom@3.2.8/dist/runtime-dom.esm-browser.js'
);

function updateRuntime(code: string) {
  vueRuntimeURL.value = code;
}
const useFileStore = defineStore('FILE_STORE', {
  state: () => {
    return {
      files: {
        html: createFile('html', defaultHtml),
        css: createFile('css', defaultCss),
        javascript: createFile('javascript', defaultJavascript),
        'App.vue': createFile('App.vue'),
      } as Files,
    };
  },
  getters: {
    getSFC(state) {
      return `
        <script setup>
          ${state.files['javascript'] ? state.files['javascript'].code : ''}
        </script>
        <template>
          ${state.files['html'] ? state.files['html'].code : ''}
        </template>
        <style scoped>
          ${state.files['css'] ? state.files['css'].code : ''}
        </style>
      `;
    },
  },
  actions: {
    addFile(fileName: FileName) {
      const newFile = createFile(fileName);
      this.files[fileName] = newFile;
    },

    updateFile(code: string, fileName: FileName) {
      if (!this.files[fileName]) {
        this.files[fileName] = createFile(fileName, code);
      } else {
        this.files[fileName]!.code = code;
      }
    },

    removeFile(fileName: FileName) {
      delete this.files[fileName];
    },

    updateCompiledFile(compiled: File['compiled'], fileName: FileName) {
      this.files[fileName]!.compiled = compiled;
    },
  },
});

type UseNullStore = ReturnType<typeof defineStore>;
type NullStore = ReturnType<UseNullStore>;
type FileStore = ReturnType<typeof useFileStore>;
export type FileStoreSGA = Omit<FileStore, keyof NullStore>;

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
    updateImportMap(code: string) {
      this.importMap = code;
      let json = JSON.parse(code);
      if (json.imports.vue) {
        updateRuntime(json.imports.vue);
      }
    },
  },
});

function updateActiveFile(curActiveFile: string) {
  activeFile.value = curActiveFile;
}

function createFile(filename: FileName, code = ''): File {
  return {
    filename,
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
};
