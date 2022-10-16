<script setup>
import { onMounted, inject, watch } from 'vue';
import { useMonaco } from '@/utils/useMonaco';
import { resizeListener } from '@/utils/utility';
import { useFileStore } from '@/store/useFileStore';

const FILE_STORE = useFileStore();
let element;
let editor;
const { isResizing } = inject('getResizing');

watch(isResizing, () => {
  resizeListener(editor, element);
});

onMounted(() => {
  element = document.querySelector('#htmlEditor');
  editor = useMonaco(element, 'css');

  editor.getModel().onDidChangeContent(() => {
    FILE_STORE.updateFile(editor.getValue(), 'css');
  });
});

function formatHandler() {
  editor.getAction('editor.action.formatDocument')._run();
  console.log(editor.getAction('editor.action.formatDocument'));
}
</script>
<template>
  <div class="wrapper">
    <div class="title">
      <h5>HTML</h5>
      <button class="formatButton" @click="formatHandler">✨</button>
    </div>
    <div id="htmlEditor" class="editor"></div>
  </div>
</template>
