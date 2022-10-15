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
  element = document.querySelector('#htmlEditor');
  editor = useMonaco(element, 'html');
});
</script>
<template>
  <div class="wrapper">
    <h5>HTML</h5>
    <div id="htmlEditor" class="editor"></div>
  </div>
</template>
