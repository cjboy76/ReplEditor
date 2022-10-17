<script setup>
import { useMonaco } from '@/utils/useMonaco';
import { onMounted, ref } from 'vue';

const element = ref();
onMounted(() => {
  useMonaco(element.value, 'JSON', {
    lineNumbers: 'off',
    glyphMargin: false,
    folding: false,
    lineDecorationsWidth: 0,
    lineNumbersMinChars: 0,
    fontSize: '14px',
  });
});

function onChange(value, type) {
  console.log(value, type);
}
</script>
<template>
  <div class="import-map">
    <div ref="element" class="element"></div>
  </div>
</template>

<style scoped>
.import-map {
  height: 400px;
  padding: 1rem;
  background-color: var(--bg-default);
}
.element {
  height: 100%;
}
</style>
