import { ref } from 'vue';

const vueMode = ref(false);

function setVueMode(value) {
  vueMode.value = value;
}

export { vueMode, setVueMode };
