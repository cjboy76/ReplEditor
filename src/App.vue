<script setup>
import Repl from "@/components/Repl.vue";
</script>

<template>
  <repl />
</template>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: var(--bg-default);
}
</style>
