<script setup>
// import Split from 'split.js';
// import { provide } from 'vue';
import Playground from '@/components/Playground.vue';
import Preview from '@/components/Preview.vue';
import AppModal from '@/components/AppModal.vue';
import ImportMap from '@/components/ImportMap.vue';
// import { resizeListener } from '@/utils/useMonaco';
// import {
//   activeFile,
//   updateActiveFile,
//   isDarkMode,
//   toggleTheme,
// } from '@/store/useFileStore';
import AppHeader from '@/components/AppHeader.vue';
import { ref, watch } from 'vue';

// onMounted(() => {
//   Split(['#editor-wrapper', '#preview'], {
//     gutterSize: 10,
//     sizes: [50, 50],
//     onDrag() {
//       resizeListener();
//     },
//   });
// });

const toggleModal = ref(false);
function openModal() {
  toggleModal.value = true;
  console.log('trigger');
}
watch(toggleModal, (value) => console.log(value));
</script>

<template>
  <AppHeader @open-modal="openModal" />
  <div id="Repl">
    <splitpanes class="default-theme">
      <pane>
        <Playground />
      </pane>
      <pane>
        <Preview />
      </pane>
    </splitpanes>
  </div>
  <app-modal width="70%" v-model="toggleModal">
    <import-map></import-map>
  </app-modal>
</template>

<style lang="scss" scoped>
#Repl {
  display: flex;
  height: 100%;
}
// .gutter {
//   background-color: var(--text-default);
// }
// .gutter:hover {
//   cursor: col-resize;
// }
</style>
