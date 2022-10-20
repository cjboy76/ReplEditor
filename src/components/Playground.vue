<script setup>
import { Editor, EditorContainer } from '@/components/crafts';
import { onUnmounted, onMounted } from 'vue';
import { useFileStore, useImportMap } from '@/store/useFileStore';
import JsEditor from '@/components/JsEditor.vue';

const FILE_STORE = useFileStore();
const IMPORT_MAP = useImportMap();

// import { useFileStore, useImportMap } from '@/store/useFileStore';
// import { debounce, appendListener, removeListener } from '@/utils/utility';
// import { resizeListener } from '@/utils/utility';

// import { transformSFC } from '@/output/transform';
// import FileSystem from '@/components/FileSystem.vue';

// const { activeFile } = inject('activeFile');
// const { isDarkMode } = inject('themeMode');
// const FILE_STORE = useFileStore();
// const IMPORT_MAP = useImportMap();
// let webEditor;

// watch(activeFile, (newValue) => {
//   setEditorContent(newValue);
// });

// watch(isDarkMode, (newValue) => {
//   if (!newValue) {
//     setEditorTheme('vitesse-light');
//   } else {
//     setEditorTheme('vitesse-dark');
//   }
// });
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

function changeHandler(value, key) {
  if (key === 'JSON') {
    IMPORT_MAP.updateImportMap(value);
  } else if (key === 'javascript') {
    FILE_STORE.updateFile(value, key);
  }
}
</script>
<template>
  <div class="playground">
    <splitpanes class="default-theme" horizontal style="height: 100vh">
      <pane>
        <editor-container lang="HTML">
          <editor lang="html" @on-change="changeHandler" />
        </editor-container>
      </pane>
      <pane>
        <editor-container lang="CSS">
          <editor lang="css" @on-change="changeHandler" />
        </editor-container>
      </pane>
      <pane>
        <js-editor @on-change="changeHandler"></js-editor>
      </pane>
    </splitpanes>
  </div>
</template>

<style scoped>
.playground {
  border-top: 1px solid var(--border-default);
}
</style>
