<script setup lang="ts">
import { Editor, EditorContainer } from './crafts';
import { ref, watch } from 'vue';
import { useFileStore, useImportMap } from '../store/useFileStore';
import { defaultJavascript } from '../store/globalStatus';
import type { Files } from '../types';

const IMPORT_MAP_STORE = useImportMap();
const FILE_STORE = useFileStore();
const code = ref(defaultJavascript);
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

function getCode(files: Partial<Files>, key: keyof Files) {
  if (!files[key] || !files[key]?.code) return '';
  return files[key]!.code;
}

function toggleImportMap() {
  importMapOn.value = !importMapOn.value;
}

function changeHandler(value: string, language: string) {
  emits('onChange', value, language);
}
</script>

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

<style scoped>
.triggerStyle {
  color: var(--bg-secondary);
  background-color: var(--text-highlight);
}
</style>
