<script setup lang="ts">
import { Splitpanes, Pane } from "splitpanes";
import { Editor, EditorContainer } from "./crafts";
import { useFileStore, useImportMap } from "../store/useFileStore";
import { transformSFC } from "../output/SFCcompiler";
import { defaultHtml, defaultCss } from "../store/globalStatus";
import { onMounted } from "vue";
import type { FileName } from "../types";
import JsEditor from "@/components/JsEditor.vue";

const FILE_STORE = useFileStore();
const IMPORT_MAP = useImportMap();

onMounted(() => {
  compileForVue();
});

function compileForVue() {
  FILE_STORE.updateFile(FILE_STORE.getSFC, "App.vue");
  transformSFC(FILE_STORE, FILE_STORE.files["App.vue"]!);
}

function changeHandler(value: string, key: FileName) {
  if (key === "JSON") {
    IMPORT_MAP.updateImportMap(value);
  } else {
    FILE_STORE.updateFile(value, key);
  }
  compileForVue();
}
</script>
<template>
  <div class="playground">
    <splitpanes class="default-theme" horizontal style="height: 100vh">
      <pane>
        <editor-container lang="HTML">
          <editor lang="html" @on-change="changeHandler" :code="defaultHtml" />
        </editor-container>
      </pane>
      <pane>
        <editor-container lang="CSS">
          <editor lang="css" @on-change="changeHandler" :code="defaultCss" />
        </editor-container>
      </pane>
      <pane>
        <js-editor @on-change="changeHandler"></js-editor>
      </pane>
    </splitpanes>
  </div>
</template>

<style scoped>
.playground {
  border-top: 1px solid var(--border-default);
}
</style>
