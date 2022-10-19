<template>
  <editor-container :lang="title">
    <template #button>
      <button @click="toggleImportMap" :class="{ triggerStyle: importMapOn }">
        Import Map
      </button>
    </template>
    <editor :lang="language" :code="code" @on-change="changeHandler" />
  </editor-container>
</template>
<script setup>
import { Editor, EditorContainer } from '@/components/crafts';
import { onMounted, ref, watch } from 'vue';
import { useFileStore, useImportMap } from '@/store/useFileStore';

const IMPORT_MAP_STORE = useImportMap();
const FILE_STORE = useFileStore();
const code = ref('');
const language = ref('javascript');
const title = ref('JavaScript');
const importMapOn = ref(false);
const emits = defineEmits(['onChange']);

watch(
  () => importMapOn.value,
  (value) => {
    language.value = value ? 'JSON' : 'javascript';
    title.value = value ? 'JSON' : 'JavaScript';
    code.value = value
      ? IMPORT_MAP_STORE.importMap
      : getCode(FILE_STORE.files, 'javascript');
  }
);

onMounted(() => {
  code.value = getCode(FILE_STORE.files, language.value);
});

function getCode(store, key) {
  if (!store[key] || !store[key].code) return '';
  return store[key].code;
}

function toggleImportMap() {
  importMapOn.value = !importMapOn.value;
}

function changeHandler(value, language) {
  emits('onChange', value, language);
}
</script>

<style scoped>
.triggerStyle {
  color: var(--bg-secondary);
  background-color: var(--text-highlight);
}
</style>
