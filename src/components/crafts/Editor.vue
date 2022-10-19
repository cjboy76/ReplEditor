<script setup>
import { onMounted, ref, watch } from 'vue';
import { useMonaco } from '@/utils/useMonaco';
import { editor } from 'monaco-editor';

const props = defineProps({
  lang: String,
  code: String,
});
const emits = defineEmits(['onChange']);
const target = ref();
let monacoEditor;

onMounted(() => {
  monacoEditor = useMonaco(target.value, props.lang, {
    value: props.code,
  });
  monacoEditor.getModel().onDidChangeContent(() => {
    emits('onChange', monacoEditor.getValue(), props.lang);
  });
});

watch(
  () => props.lang,
  (newValue) => {
    editor.setModelLanguage(monacoEditor.getModel(), newValue);
  }
);
watch(
  () => props.code,
  (newValue) => {
    monacoEditor.getModel().setValue(newValue);
  }
);
</script>
<template>
  <div ref="target" class="editor"></div>
</template>

<style scoped>
.editor {
  height: 100vh;
  width: 100vw;
}
</style>
