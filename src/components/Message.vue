<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  error: {
    type: String || Error,
  },
});

const show = ref(false);
let timer;

watch(
  () => props.error,
  () => {
    show.value = true;
    startTimeout(10000);
  }
);

function startTimeout(delay = 3000) {
  if (timer) {
    clearTimeout(timer);
  }
  timer = setTimeout(() => {
    show.value = false;
  }, delay);
}

function closeMsg() {
  show.value = false;
  clearTimeout(timer);
}
</script>

<template>
  <div class="message" v-show="show">
    <pre>{{ error }}</pre>
    <button class="button" @click="closeMsg">X</button>
  </div>
</template>

<style>
.message {
  position: absolute;
  bottom: 0px;
  right: 0px;
  left: 0px;
  top: 0px;
  z-index: 999;
  border: 2px solid red;
  color: red;
  padding: 10px;
  background: rgba(0, 0, 0, 0.822);
  display: flex;
  justify-content: space-evenly;
}
.button {
  width: 20px;
  height: 20px;
  color: white;
  border-radius: 50%;
  background: red;
  border: none;
  cursor: pointer;
  text-align: center;
  vertical-align: middle;
}
</style>
