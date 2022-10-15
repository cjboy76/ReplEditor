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
  element = document.querySelector('#jsEditor');
  editor = useMonaco(element, 'javascript');
  resize = resizeListener(editor, element);
  appendListener(element, 'resize', resize);
});
onUnmounted(() => {
  removeListener(element, 'resize', resize);
});
</script>
<template>
  <div class="wrapper">
    <h5>JavaScript</h5>
    <div id="jsEditor" class="editor"></div>
  </div>
</template>
