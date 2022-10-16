<script setup>
import { onUnmounted, onMounted, ref, watchEffect } from 'vue';
import MaterialSymbolsDesktopWindowsOutline from '~icons/material-symbols/desktop-windows-outline';
import {
  useFileStore,
  defaultMainFile,
  useImportMap,
} from '../store/useFileStore';
import srcdoc from '../output/playground.html?raw';
import {
  compileModulesForPreview,
  compileStoreForPreview,
} from '../output/moduleComplier';
import { appendListener, removeListener } from '../utils/utility';
import Message from '@/components/Message.vue';
import EditorContainer from '@/components/EditorContainer.vue';

const preview = ref();
const FILE_STORE = useFileStore();
const IMPORT_MAP = useImportMap();
const runtimeError = ref(null);
let sandBox;
let stopViewWatcher;

IMPORT_MAP.$subscribe(() => {
  createSandBox();
});

onMounted(() => {
  createSandBox();
  appendListener(window, 'message', handleSandboxEvent);
});

onUnmounted(() => {
  removeListener(sandBox, 'load', () => {
    watchEffect(updateView);
  });
  stopViewWatcher && stopViewWatcher();
  removeListener(window, 'message', handleSandboxEvent);
});

function createSandBox() {
  if (sandBox) {
    stopViewWatcher && stopViewWatcher();
    preview.value.removeChild(sandBox);
  }

  sandBox = document.createElement('iframe');
  sandBox.setAttribute(
    'sandbox',
    [
      'allow-forms',
      'allow-modals',
      'allow-pointer-lock',
      'allow-popups',
      'allow-same-origin',
      'allow-scripts',
      'allow-top-navigation-by-user-activation',
    ].join(' ')
  );

  const sandBoxSrc = srcdoc.replace(
    /<!--IMPORT_MAP-->/,
    IMPORT_MAP.$state.importMap
  );
  sandBox.srcdoc = sandBoxSrc;
  preview.value.appendChild(sandBox);
  appendListener(sandBox, 'load', () => {
    // stopViewWatcher = watchEffect(updateView);
    stopViewWatcher = watchEffect(sendScriptToView);
  });
}

function updateView() {
  const modules = compileModulesForPreview(FILE_STORE);
  const codeToEval = [
    `window.__modules__ = {};window.__css__ = '';` +
      `if (window.__app__) window.__app__.unmount();` +
      `document.body.innerHTML = '<div id="app"></div>'`,
    ...modules,
    `document.getElementById('playground_styles').innerHTML = window.__css__`,
  ];

  codeToEval.push(`
        import { createApp as _createApp } from "vue"
        const _mount = () => {
          const AppComponent = __modules__["${defaultMainFile}"].default
          AppComponent.name = 'Repl'
          const app = window.__app__ = _createApp(AppComponent)
          app.config.unwrapInjectedRef = true
          app.config.errorHandler = e => console.error(e)
          app.mount('#app')
        }
        _mount()
        `);

  sandBox.contentWindow.postMessage(
    {
      action: 'eval',
      code: codeToEval,
    },
    '*'
  );
}

function sendScriptToView() {
  runtimeError.value = null;
  const modules = compileStoreForPreview(FILE_STORE);

  const codeToEval = [
    `window.__css__ = '';`,
    ...modules,
    `document.getElementById('playground_styles').innerHTML = window.__css__`,
  ];

  sandBox.contentWindow.postMessage(
    {
      action: 'eval',
      code: codeToEval,
    },
    '*'
  );
}

function handleSandboxEvent({ data }) {
  console.log(data);
  const { action, value } = data;
  console.log(value);
  if (action === 'error') {
    runtimeError.value = value;
  }
}
</script>

<template>
  <div style="position: relative" class="container">
    <div class="title">
      <span> View </span>
      <button>
        <MaterialSymbolsDesktopWindowsOutline class="icon" />
      </button>
    </div>
    <splitpanes class="default-theme" horizontal style="height: 100vh">
      <pane>
        <div class="preview" ref="preview"></div>
      </pane>
      <pane>
        <editor-container lang="Console">
          <Message :error="runtimeError" />
        </editor-container>
      </pane>
    </splitpanes>
  </div>
</template>

<style lang="scss" scoped>
.container {
  border: 1px solid var(--border-default);
  .title {
    padding-left: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: var(--bg-default);
    border-bottom: 1px solid var(--border-default);
    color: var(--text-default);
    .icon {
      color: var(--text-default);
    }
  }

  .preview {
    height: 100%;

    :deep(iframe) {
      width: 100%;
      height: 100%;
      border: none;
      background-color: #fff;
    }
  }
}
</style>
