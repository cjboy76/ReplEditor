<template>
  <div class="wrapper">
    <div class="title">
      <h5 class="text">
        {{ props.lang }}
      </h5>
      <slot name="button"></slot>
    </div>
    <slot></slot>
  </div>
</template>
<script setup>
const props = defineProps({
  lang: String,
});
</script>
<style lang="scss" scoped>
.wrapper {
  // padding-top: 5px;
  background: var(--bg-secondary);
  height: 100%;
  .title {
    display: flex;
    justify-content: space-between;
    background-color: var(--bg-default);
    .text {
      color: var(--text-default);
      padding-left: 10px;
    }
  }
}
</style>
