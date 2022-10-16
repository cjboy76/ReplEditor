<script setup>
import HtmlEditor from '@/components/editors/htmlEditor.vue';
import CssEditor from '@/components/editors/cssEditor.vue';
import JsEditor from '@/components/editors/jsEditor.vue';
import { onUnmounted, onMounted, watch, inject } from 'vue';

// import { useFileStore, useImportMap } from '@/store/useFileStore';
// import { debounce, appendListener, removeListener } from '@/utils/utility';
// import { resizeListener } from '@/utils/utility';

// import { transformSFC } from '@/output/transform';
// import FileSystem from '@/components/FileSystem.vue';

const { activeFile } = inject('activeFile');
const { isDarkMode } = inject('themeMode');
const { setResizing } = inject('getResizing');
// const FILE_STORE = useFileStore();
// const IMPORT_MAP = useImportMap();
// let webEditor;

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
// let cssElement;
// let jsElement;
// let cssEditor;
// let jsEditor;
onMounted(() => {
  // cssElement = document.querySelector('#cssEditor');
  // jsElement = document.querySelector('#jsEditor');
  // cssEditor = useMonaco(cssElement, 'html');
  // jsEditor = useMonaco(jsElement, 'html');
  // webEditor = useMonaco(document.querySelector('#editor'), 'html');
  // transformSFC(FILE_STORE, FILE_STORE.files[activeFile.value]);
  // webEditor.getModel().onDidChangeContent(
  //   debounce(() => {
  //     if (activeFile.value === 'ImportMap') {
  //       IMPORT_MAP.updateImportMap(webEditor.getValue());
  //       return;
  //     }
  // FILE_STORE.updateFile(webEditor.getValue(), activeFile.value);
  // transformSFC(FILE_STORE, FILE_STORE.files[activeFile.value]);
  // })
  // );
  // appendListener(window, 'resize', resizeListener);
});
onUnmounted(() => {
  // removeListener(window, 'resize', resizeListener);
});

// function setEditorContent(fileName) {
//   if (fileName === 'ImportMap') {
//     Monaco.editor.setModelLanguage(webEditor.getModel(), 'json');
//     webEditor.getModel().setValue(IMPORT_MAP.$state.importMap);
//     return;
//   }
//   Monaco.editor.setModelLanguage(
//     webEditor.getModel(),
//     getFileType(fileName)
//   );
//   const fileInStore = FILE_STORE.$state.files[fileName];
//   webEditor.getModel().setValue(fileInStore.code);
// }

// function getFileType(fileName) {
//   return fileName.endsWith('js')
//     ? 'javascript'
//     : fileName.endsWith('vue')
//     ? 'html'
//     : 'css';
// }

// function setEditorTheme(theme) {
//   Monaco.editor.setTheme(theme);
// }
</script>
<template>
  <div id="editor-wrapper">
    <splitpanes
      class="default-theme"
      horizontal
      style="height: 100vh"
      @resize="setResizing(true)"
      @resized="setResizing(false)"
    >
      <pane max-size="70">
        <html-editor />
      </pane>
      <pane max-size="70">
        <css-editor />
      </pane>
      <pane max-size="70">
        <js-editor />
      </pane>
    </splitpanes>
  </div>
</template>

<style lang="scss">
#editor-wrapper {
  border: 1px solid black;
  .wrapper {
    padding: 5px;
    .title {
      display: flex;
      justify-content: space-between;
      .formatButton {
        border: none;
        cursor: pointer;
      }
    }
    .editor {
      height: 100vh;
      width: 100%;
    }
  }
}
</style>
