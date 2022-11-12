import { ref } from 'vue';
import type { Ref } from 'vue';

const defaultHtml = `<div id="app">
  <div>
    <h1> Hello {{ title }} </h1>
    <p align="center">Switch on Vue mode 👆</p>
  </div>
</div>
`;
const defaultCss = `#app {
  height: 100vh;
  background-color: darkcyan;
  color: white;
  display: grid;
  place-items: center
}
`;
const defaultJavascript = `import { ref } from "vue"

const title = ref("ReplEditor")
                          `;
const vueMode: Ref<boolean> = ref(false);

function setVueMode(value: boolean) {
  vueMode.value = value;
}

const VueModeInjectProvide = {
  vueMode,
  setVueMode,
};

export { defaultHtml, defaultCss, defaultJavascript, VueModeInjectProvide };
