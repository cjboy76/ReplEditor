<script setup>
// import Split from 'split.js';
import { onMounted, provide, ref } from 'vue';
import Editor from '@/components/Editor.vue';
import Preview from '@/components/Preview.vue';
// import { resizeListener } from '@/utils/useMonaco';
import {
  activeFile,
  updateActiveFile,
  isDarkMode,
  toggleTheme,
} from '@/store/useFileStore';
import AppHeader from '@/components/AppHeader.vue';

// onMounted(() => {
//   Split(['#editor-wrapper', '#preview'], {
//     gutterSize: 10,
//     sizes: [50, 50],
//     onDrag() {
//       resizeListener();
//     },
//   });
// });

provide('themeMode', { isDarkMode, toggleTheme });
provide('activeFile', { activeFile, updateActiveFile });

const isResizing = ref(false);
function setResizing(value) {
  console.log(value);
  isResizing.value = value;
}

provide('getResizing', {
  isResizing,
  setResizing,
});
</script>

<template>
  <AppHeader />
  <div id="Repl">
    <splitpanes
      class="default-theme"
      @resize="setResizing(true)"
      @resized="setResizing(false)"
    >
      <pane>
        <Editor />
      </pane>
      <pane>
        <Preview />
      </pane>
    </splitpanes>
  </div>
</template>

<style lang="scss" scoped>
#Repl {
  display: flex;
  height: 100%;
  border-top: 0.5px solid var(--border-default);
}
// .gutter {
//   background-color: var(--text-default);
// }
// .gutter:hover {
//   cursor: col-resize;
// }
</style>
