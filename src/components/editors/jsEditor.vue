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
  element = document.querySelector('#jsEditor');
  editor = useMonaco(element, 'javascript');

  editor.getModel().onDidChangeContent(() => {
    FILE_STORE.updateFile(editor.getValue(), 'javascript');
  });
});

function formatHandler() {
  editor.getAction('editor.action.formatDocument')._run();
}
</script>
<template>
  <div class="wrapper">
    <div class="title">
      <h5>JavaScript</h5>
      <button class="formatButton" @click="formatHandler">✨</button>
    </div>
    <div id="jsEditor" class="editor"></div>
  </div>
</template>
