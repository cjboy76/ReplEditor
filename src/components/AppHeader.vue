<script setup>
import { inject } from 'vue';
import Fa6SolidMoon from '~icons/fa6-solid/moon';
import Fa6SolidSun from '~icons/fa6-solid/sun';
import GithubIcon from '@/components/GithubIcon.vue';
import { currentRuntimeVersion } from '@/store/useFileStore';

const { isDarkMode, toggleTheme } = inject('themeMode');
</script>

<template>
  <header>
    <div class="header">
      <h1 class="headerText">Vue Playground</h1>
      <div class="options">
        <button
          class="toggleTheme"
          :class="{ spin_right: isDarkMode, spin_left: !isDarkMode }"
        >
          <Fa6SolidSun v-show="isDarkMode" class="icon" @click="toggleTheme" />
          <Fa6SolidMoon
            v-show="!isDarkMode"
            class="icon"
            @click="toggleTheme"
          />
        </button>
        <span>Version @{{ currentRuntimeVersion }}</span>
        <a href="https://github.com/cjboy76/MarioEditor" target="_blank">
          <GithubIcon :isDarkMode="isDarkMode" />
        </a>
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.header {
  width: 98%;
  margin: auto;
  color: var(--text-default);
  display: flex;
  justify-content: space-between;
  align-items: center;
  .headerText {
    background: -webkit-linear-gradient(0.9turn, #3f87a6, #ebf8e1, #f69d3c);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .icon {
      cursor: pointer;
    }
    span {
      padding: 0 1rem;
    }
    .toggleTheme {
      background-color: transparent;
      border: none;
      color: var(--text-default);
      display: flex;
      align-items: center;
    }
  }
}
.spin_right {
  animation: spin_right 0.3s ease;
}

.spin_left {
  animation: spin_left 0.3s ease;
}

@keyframes spin_right {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes spin_left {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
