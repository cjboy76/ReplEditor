<script setup>
import Playground from '@/components/Playground.vue';
import Preview from '@/components/Preview.vue';
import AppHeader from '@/components/AppHeader.vue';
</script>

<template>
  <AppHeader />
  <div id="Repl">
    <splitpanes class="default-theme">
      <pane>
        <Playground />
      </pane>
      <pane>
        <Preview />
      </pane>
    </splitpanes>
  </div>
</template>

<style lang="scss" scoped>
#Repl {
  display: flex;
  height: 100%;
}
</style>
