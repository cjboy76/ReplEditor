<script setup>
import { computed, onMounted, ref, inject } from "vue";
import { useFileStore, defaultMainFile } from "@/store/useFileStore";

const fileStore = useFileStore();
const filesSystem = ref(new Set());
const fileList = computed(() => {
  return [...filesSystem.value];
});
const placeholder = ref("Sample.vue");
const pending = ref(false);
const { activeFile, updateActiveFile } = inject("activeFile");

onMounted(() => {
  filesSystem.value.add(defaultMainFile);
});

function addFileDone() {
  if (!pending.value) return;
  const fileName = placeholder.value;
  if (!/\.(js|css|vue)$/.test(fileName)) {
    alert("File type not allowed.");
    return;
  }
  const isDuplicate = checkDuplicate(filesSystem.value, fileName);
  if (isDuplicate) {
    alert("File name existed.");
    return;
  }

  addFileCancel();
  filesSystem.value.add(fileName);
  fileStore.addFile(fileName);
  updateActiveFile(fileName);
}

function addFileCancel() {
  placeholder.value = "Sample.vue";
  pending.value = false;
}

function focus({ el }) {
  el.focus();
}

function addFileStart() {
  pending.value = true;
}

function removeFile(fileName) {
  const deleteConfirm = confirm(
    `Confirm to delete ${fileName}?\n確定要刪除 ${fileName}?\n本当にファイルを削除しますか ${fileName}?`
  );
  if (!deleteConfirm) return;
  if (activeFile.value === fileName) {
    updateActiveFile(defaultMainFile);
  }
  fileStore.removeFile(fileName);
  filesSystem.value.delete(fileName);
}

function checkDuplicate(files, fileName) {
  return files.has(fileName);
}

function toggleImportMap() {
  updateActiveFile("ImportMap");
}
</script>

<template>
  <div
    class="file"
    v-for="file of fileList"
    :key="file"
    :class="{ active: activeFile === file }"
  >
    <span @click="updateActiveFile(file)">
      {{ file }}
    </span>
    <span
      style="padding: 0"
      v-if="file.name !== 'App.vue'"
      @click="removeFile(file)"
      >✖️</span
    >
  </div>
  <div v-if="pending" class="file addFile">
    <input
      type="text"
      spellcheck="false"
      v-model="placeholder"
      @keyup.enter="addFileDone"
      @keyup.esc="addFileCancel"
      @blur="addFileDone"
      @vnodeMounted="focus"
    />
  </div>
  <button class="addButton" @click="addFileStart">➕</button>
  <button class="addButton importmap-btn" @click="toggleImportMap">
    Import Map
  </button>
</template>

<style lang="scss" scoped>
@mixin basic-button {
  cursor: pointer;
  border: none;
  color: var(--text-default);
  background: var(--bg-default);
}
.file {
  display: inline-block;
  span {
    display: inline-block;
    padding: 0.5em 2em 0.3rem;
    line-height: 20px;
    color: var(--text-default);
    cursor: pointer;
  }
}

.active {
  border-bottom: 2px solid var(--text-highlight);
  color: var(--text-highlight);
}
.addFile {
  color: var(--text-default);
  > input {
    padding: 0.1rem;
    border: none;
    width: 4rem;
    outline: none;
    border-radius: 5%;
    width: 90px;
    height: 30px;
    line-height: 30px;
  }
}
.addButton {
  @include basic-button;
  margin-left: 6px;
}
.importmap-btn {
  @include basic-button;
  padding: 0.5rem 1rem 0.5rem;
  line-height: 20px;
  float: right;
}
</style>
