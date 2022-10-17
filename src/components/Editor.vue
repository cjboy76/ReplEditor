<script setup>
import { onMounted, ref } from 'vue';
import { useMonaco } from '@/utils/useMonaco';

const props = defineProps({
  lang: String,
  code: String,
});
const emit = defineEmits(['onChange']);
const target = ref();

onMounted(() => {
  const editor = useMonaco(target.value, props.lang, { value: props.code });
  editor.getModel().onDidChangeContent(() => {
    emit('onChange', editor.getValue(), props.lang);
  });
});
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
