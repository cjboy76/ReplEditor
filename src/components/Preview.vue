<script setup>
import {
  onUnmounted,
  onMounted,
  ref,
  watchEffect,
  computed,
  inject,
  watch,
} from 'vue';
import MaterialSymbolsDesktopWindowsOutline from '~icons/material-symbols/desktop-windows-outline';
import MaterialSymbolsKeyboardArrowDown from '~icons/material-symbols/keyboard-arrow-down';
import IcBaselineCheck from '~icons/ic/baseline-check';
import { Console, EditorContainer } from '@/components/crafts';
import {
  useFileStore,
  defaultMainFile,
  useImportMap,
} from '../store/useFileStore';
import srcdoc from '../output/playground.html?raw';
import { vueCompiler, rawCompiler } from '../output/moduleComplier';
import { appendListener, removeListener } from '../utils/utility';
import { Hako } from 'vue-hako';
import viewSizeOptions from '@/data/screen-size.json';

const { vueMode } = inject('vueMode');
const preview = ref();
const FILE_STORE = useFileStore();
const IMPORT_MAP = useImportMap();
const runtimeError = ref(null);
let sandBox;
let stopWatcher;

IMPORT_MAP.$subscribe(() => {
  createSandBox();
});
watch(vueMode, () => {
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
  stopWatcher && stopWatcher();
  removeListener(window, 'message', handleSandboxEvent);
});

function createSandBox() {
  if (sandBox) {
    stopWatcher && stopWatcher();
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
    if (vueMode.value) {
      stopWatcher = watchEffect(updateView);
    } else {
      stopWatcher = watchEffect(sendScriptToView);
    }
  });
}

function updateView() {
  if (!vueMode.value) return;
  const modules = vueCompiler(FILE_STORE);
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
  if (vueMode.value) return;

  runtimeError.value = null;
  // console.clear();
  const modules = rawCompiler(FILE_STORE);

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
  const { action, value } = data;
  if (action === 'error') {
    runtimeError.value = value;
  }
}

const isDefaultSize = computed(() => currentViewSize.value === 'Default');
const width = computed(() => viewSizeOptions[currentViewSize.value][0]);
const height = computed(() => viewSizeOptions[currentViewSize.value][1]);
const toggleViewMenu = ref(false);
const currentViewSize = ref('Default');
function toggleMenu() {
  toggleViewMenu.value = !toggleViewMenu.value;
}
function setViewSize(value) {
  currentViewSize.value = value;
}
</script>

<template>
  <div class="container">
    <div class="viewTitle">
      <h5>View</h5>
      <button @click="toggleMenu" class="menuButton">
        <MaterialSymbolsDesktopWindowsOutline class="icon" />
        <span> {{ currentViewSize }} </span>
        <MaterialSymbolsKeyboardArrowDown />
        <div class="menu" v-show="toggleViewMenu">
          <div
            v-for="(_, index) in viewSizeOptions"
            :key="index"
            class="option"
            @click="setViewSize(index)"
          >
            <p align="start">
              {{ index }}
            </p>
            <IcBaselineCheck v-show="currentViewSize === index" />
          </div>
        </div>
      </button>
    </div>
    <splitpanes class="default-theme" horizontal style="height: 100vh">
      <pane :class="{ 'py-10px': !isDefaultSize }">
        <Hako
          style="height: 100%"
          :width="width"
          :height="height"
          :disable-scaling="isDefaultSize"
        >
          <div class="preview" ref="preview"></div>
        </Hako>
      </pane>
      <pane>
        <editor-container lang="Console">
          <Console :error="runtimeError" />
        </editor-container>
      </pane>
    </splitpanes>
  </div>
</template>

<style lang="scss" scoped>
.container {
  border: 1px solid var(--border-default);
  .viewTitle {
    background-color: var(--bg-default);
    color: var(--text-default);
    display: flex;
    justify-content: space-between;
    align-items: center;
    h5 {
      padding-left: 5px;
    }
  }
  .menuButton {
    position: relative;
    color: var(--text-default);
    .menu {
      z-index: 9999;
      position: absolute;
      top: 100%;
      right: 0%;
      width: 180px;
      height: fit-content;
      // border: 1px solid var(--bg-default);
      box-shadow: 0px 0px 3px var(--border-default);
      background-color: var(--bg-default);
      border-radius: 3px;
      .option {
        // display: block;
        display: flex;
        justify-content: space-between;
        padding: 10px;
        &:hover {
          background-color: var(--border-default);
        }
      }
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
.py-10px {
  padding: 10px 0;
}
</style>
