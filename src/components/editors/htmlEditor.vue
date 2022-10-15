<script setup>
import { onUnmounted, onMounted, inject, watch } from 'vue';
import { useMonaco } from '@/utils/useMonaco';
import {
  //   appendListener,
  removeListener,
  resizeListener,
} from '@/utils/utility';

let element;
let editor;
let resize;

const { isResizing } = inject('getResizing');
console.log(isResizing);
watch(isResizing, (value) => {
  //   if (!value) return;
  //   console.log('trigger');
  resizeListener(editor, element);
  //   console.log('isResizing', value);
});

onMounted(() => {
  element = document.querySelector('#htmlEditor');
  editor = useMonaco(element, 'html');
  //   resize = resizeListener(editor, element);
  //   appendListener(element.parentElement, 'resize', resize);
});
onUnmounted(() => {
  removeListener(element, 'resize', resize);
});
</script>
<template>
  <div class="wrapper">
    <h5>HTML</h5>
    <div id="htmlEditor" class="editor"></div>
  </div>
</template>
