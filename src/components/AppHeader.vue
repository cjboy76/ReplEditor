<script setup lang="ts">
import Fa6SolidMoon from "~icons/fa6-solid/moon";
import PhSunDuotone from "~icons/ph/sun-duotone";
import BytesizeLightning from "~icons/bytesize/lightning";
import MdiGithub from "~icons/mdi/github";
import { Switch } from "./crafts";
import { repository } from "../../package.json";
import { editor } from "monaco-editor";
import { inject, ref } from "vue";
import { VueModeInjectProvide } from "../store/globalStatus";

const { setVueMode } = inject("vueMode", VueModeInjectProvide);
const isDarkMode = ref(false);

function toggleTheme(value: boolean) {
  isDarkMode.value = value;
  if (value) {
    document.documentElement.setAttribute("data-theme", "dark");
    editor.setTheme("vitesse-dark");
  } else {
    document.documentElement.setAttribute("data-theme", "light");
    editor.setTheme("vitesse-light");
  }
}
</script>

<template>
  <header>
    <div class="header">
      <h1
        class="headerText"
        :class="{ 'cyberpunk-font text-glitch': isDarkMode }"
      >
        ReplEditor
        <span v-show="isDarkMode"> ReplEditor </span>
        <span v-show="isDarkMode"> ReplEditor </span>
      </h1>
      <div class="options">
        <Switch text="Vue" color="yellow" @on-change="setVueMode" />

        <button
          class="toggleTheme"
          :class="{ spin_right: isDarkMode, spin_left: !isDarkMode }"
        >
          <PhSunDuotone
            v-show="!isDarkMode"
            class="icon"
            @click="toggleTheme(true)"
          />
          <BytesizeLightning
            v-show="isDarkMode"
            class="icon"
            @click="toggleTheme(false)"
          />
        </button>

        <a :href="repository.url" target="_blank">
          <MdiGithub class="icon" />
        </a>
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
a {
  display: flex;
  place-items: center;
}
.header {
  width: 95%;
  margin: auto;
  color: var(--text-default);
  display: flex;
  justify-content: space-between;
  align-items: center;
  .headerText {
    color: var(--text-default);
  }

  .options {
    width: 12%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .icon {
      cursor: pointer;
      color: var(--text-default);
      font-size: 15px;
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
