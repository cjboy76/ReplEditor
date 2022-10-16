<template>
  <div class="wrapper">
    <div class="title">
      <h5>{{ props.lang }}</h5>
    </div>
    <slot></slot>
  </div>
</template>
<script setup>
const props = defineProps({
  lang: String,
});
</script>
<style scoped>
.wrapper {
  border: 1px solid #eee;
  padding: 5px;
  .title {
    display: flex;
    justify-content: space-between;
  }
}
</style>
