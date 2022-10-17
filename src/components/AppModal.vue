<script setup>
import { computed } from 'vue';

const props = defineProps({
  width: {
    type: String,
    default: '500px',
  },
  modelValue: {
    type: Boolean,
    default: false,
  },
});
const emits = defineEmits(['update:modelValue']);

console.log(props.modelValue);
const modalStyle = computed(() => {
  return {
    width: props.width,
  };
});
function setCloseByMask() {
  emits('update:modelValue', false);
}
</script>
<template>
  <div
    class="mask"
    v-show="props.modelValue"
    @click.self="setCloseByMask(true)"
  >
    <div class="modal" :style="modalStyle">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.mask {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: grid;
  place-items: center;
  background-color: rgba(0, 0, 0, 0.1);
  z-index: 999;
}
</style>
