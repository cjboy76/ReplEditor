<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useMonaco } from "../../utils/useMonaco";
import { editor } from "monaco-editor";
import type { editor as Editor } from "monaco-editor";

const props = defineProps({
  lang: { type: String, required: true },
  code: String,
});
const emits = defineEmits(["onChange"]);
const target = ref();
let monacoEditor: Editor.IStandaloneCodeEditor;

onMounted(() => {
  monacoEditor = useMonaco(target.value, props.lang, {
    value: props.code,
    fontSize: 14,
  });
  monacoEditor.getModel()!.onDidChangeContent(() => {
    emits("onChange", monacoEditor.getValue(), props.lang);
  });
});

watch(
  () => props.lang,
  (newValue) => {
    editor.setModelLanguage(monacoEditor.getModel()!, newValue);
  }
);
watch(
  () => props.code,
  (newValue) => {
    !!newValue && monacoEditor.getModel()!.setValue(newValue);
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
