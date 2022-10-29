import { ref } from 'vue';

const vueMode = ref(false);

const defaultHtml = `<h1> Hello {{ title }} </h1>`;
const defaultCss = `#app {
  background-color: darkcyan;
  height: 100vh;
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
