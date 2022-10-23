<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  text: String,
  color: String,
});

const emits = defineEmits(['onChange']);

const toggle = ref(false);
function toggleHandler() {
  toggle.value = !toggle.value;
  emits('onChange', toggle.value);
}

const bgColor = computed(() => {
  return toggle.value ? props.color : '';
});
</script>

<template>
  <div class="container">
    <div class="text" :style="{ color: bgColor }">
      {{ props.text }}
    </div>
    <div
      class="switch"
      :style="{ 'background-color': bgColor }"
      @click="toggleHandler"
    >
      <div class="ball" :class="{ active: toggle }"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  display: flex;
  .switch {
    width: 3rem;
    height: 1.5rem;
    border-radius: 1rem;
    background: #ccc;
    padding: -2px;
    position: relative;
    margin: 0 0.5rem;
    cursor: pointer;
    .ball {
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 50%;
      background: var(--bg-secondary);
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      transform: scale(1.1);
      transition: 0.2s ease;
    }
    .active {
      left: 1.5rem;
    }
  }
}
</style>
