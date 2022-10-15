<script setup>
import { onUnmounted, onMounted } from 'vue';
import { useMonaco } from '@/utils/useMonaco';
import {
  appendListener,
  removeListener,
  resizeListener,
} from '@/utils/utility';
let element;
let editor;
let resize;

onMounted(() => {
  element = document.querySelector('#cssEditor');
  editor = useMonaco(element, 'css');
  resize = resizeListener(editor, element);
  appendListener(element, 'resize', resize);
});
onUnmounted(() => {
  removeListener(element, 'resize', resize);
});
</script>
<template>
  <div class="wrapper">
    <h5>CSS</h5>
    <div id="cssEditor" class="editor"></div>
  </div>
</template>
