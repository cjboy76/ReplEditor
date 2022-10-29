import { ref } from 'vue';

const vueMode = ref(false);

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

function setVueMode(value) {
  vueMode.value = value;
}

export { vueMode, setVueMode, defaultHtml, defaultCss, defaultJavascript };
