<script setup>
import {
  editorInit,
  monacoEditor,
  Monaco,
  editorResize,
} from '../utils/monaco';
import { onUnmounted, onMounted, watch, inject } from 'vue';
import { useFileStore, useImportMap } from '@/store/useFileStore';
import { debounce, appendListener, removeListener } from '@/utils/utility';
import { transformSFC } from '@/output/transform';
import FileSystem from '@/components/FileSystem.vue';

const { activeFile } = inject('activeFile');
const { isDarkMode } = inject('themeMode');
const FILE_STORE = useFileStore();
const IMPORT_MAP = useImportMap();

watch(activeFile, (newValue) => {
  setEditorContent(newValue);
});

watch(isDarkMode, (newValue) => {
  if (!newValue) {
    setEditorTheme('vitesse-light');
  } else {
    setEditorTheme('vitesse-dark');
  }
});

onMounted(() => {
  editorInit();
  transformSFC(FILE_STORE, FILE_STORE.files[activeFile.value]);

  monacoEditor.getModel().onDidChangeContent(
    debounce(() => {
      if (activeFile.value === 'ImportMap') {
        IMPORT_MAP.updateImportMap(monacoEditor.getValue());
        return;
      }
      FILE_STORE.updateFile(monacoEditor.getValue(), activeFile.value);
      transformSFC(FILE_STORE, FILE_STORE.files[activeFile.value]);
    })
  );
  appendListener(window, 'resize', editorResize);
});
onUnmounted(() => {
  removeListener(window, 'resize', editorResize);
});

function setEditorContent(fileName) {
  if (fileName === 'ImportMap') {
    Monaco.editor.setModelLanguage(monacoEditor.getModel(), 'json');
    monacoEditor.getModel().setValue(IMPORT_MAP.$state.importMap);
    return;
  }
  Monaco.editor.setModelLanguage(
    monacoEditor.getModel(),
    getFileType(fileName)
  );
  const fileInStore = FILE_STORE.$state.files[fileName];
  monacoEditor.getModel().setValue(fileInStore.code);
}

function getFileType(fileName) {
  return fileName.endsWith('js')
    ? 'javascript'
    : fileName.endsWith('vue')
    ? 'html'
    : 'css';
}

function setEditorTheme(theme) {
  Monaco.editor.setTheme(theme);
}
</script>
<template>
  <div id="editor-wrapper">
    <FileSystem />
    <div id="editor"></div>
  </div>
</template>

<style lang="scss" scoped>
#editor-wrapper {
  height: 100%;
  width: 50vw;
  #editor {
    width: 99%;
    height: 100%;
  }
}
</style>
