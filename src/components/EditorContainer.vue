<template>
  <div class="wrapper">
    <h5 class="title">{{ props.lang }}</h5>
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
  padding-top: 5px;
  background: var(--bg-default);
  .title {
    color: var(--text-default);
    margin-left: 10px;
  }
}
</style>
