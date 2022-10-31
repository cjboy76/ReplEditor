<script setup lang="ts">
const props = defineProps<{
  error: Error;
}>();
</script>

<template>
  <div v-show="error" class="block">
    <div class="badge">ERROR</div>
    <span class="message">
      {{ props.error }}
    </span>
  </div>
</template>

<style lang="scss" scoped>
.block {
  display: flex;
  padding: 5px;
  align-items: center;
  .badge {
    color: white;
    background: red;
    padding: 3px 5px;
    border-radius: 5px;
    margin: 0 5px;
  }
  .message {
    color: var(--text-default);
  }
}
</style>
