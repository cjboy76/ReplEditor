<script setup>
import { onMounted, inject, watch } from 'vue';
import { useMonaco } from '@/utils/useMonaco';
import { resizeListener } from '@/utils/utility';

let element;
let editor;

const { isResizing } = inject('getResizing');
watch(isResizing, () => {
  resizeListener(editor, element);
});

onMounted(() => {
  element = document.querySelector('#cssEditor');
  editor = useMonaco(element, 'css');
});
</script>
<template>
  <div class="wrapper">
    <h5>CSS</h5>
    <div id="cssEditor" class="editor"></div>
  </div>
</template>
