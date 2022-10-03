<script setup>
import Split from "split.js";
import { onMounted, provide } from "vue";
import Editor from "@/components/Editor.vue";
import Preview from "@/components/Preview.vue";
import { editorResize } from "@/utils/monaco";
import {
  activeFile,
  updateActiveFile,
  isDarkMode,
  toggleTheme,
} from "@/store/useFileStore";
import AppHeader from "@/components/AppHeader.vue";

onMounted(() => {
  Split(["#editor-wrapper", "#preview"], {
    gutterSize: 10,
    sizes: [50, 50],
    onDrag() {
      editorResize();
    },
  });
});

provide("themeMode", { isDarkMode, toggleTheme });
provide("activeFile", { activeFile, updateActiveFile });
</script>

<template>
  <AppHeader />
  <div id="Mario">
    <Editor />
    <Preview />
  </div>
</template>

<style lang="scss" scoped>
#Mario {
  display: flex;
  height: 100%;
  border-top: 0.5px solid var(--border-default);
}
.gutter {
  background-color: var(--text-default);
}
.gutter:hover {
  cursor: col-resize;
}
</style>
