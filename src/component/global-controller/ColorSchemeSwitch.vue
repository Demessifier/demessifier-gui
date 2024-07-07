<script setup lang="ts">
import { defineStore } from "pinia";
import { faCircleHalfStroke } from "@fortawesome/free-solid-svg-icons";
import {
  supportedColorSchemes,
  getColorSchemeConfiguredOrPreferred,
  Scheme,
  setColorScheme,
  setDefaultBackgroundColor,
  getColorSchemeDefaultBackgroundColor,
} from "../../provider/color-scheme";
import ButtonWithIcon from "./ButtonWithIcon.vue";

const useDemessifierGuiColorScheme = defineStore({
  id: "demessifier-gui:color-scheme",
  state: () => {
    return {
      colorScheme: getColorSchemeConfiguredOrPreferred(), // share this as a global variable between all ColorSchemeSwitch instances
    };
  },
  actions: {
    switchSchemeTo(scheme: Scheme) {
      this.colorScheme = scheme;
      setColorScheme(scheme);
      setDefaultBackgroundColor(getColorSchemeDefaultBackgroundColor(scheme));
    },
    resetScheme() {
      this.switchSchemeTo(this.colorScheme);
    },
  },
});

const colorSchemeStore = useDemessifierGuiColorScheme();
colorSchemeStore.resetScheme();
</script>

<template>
  <div class="buttons">
    <ButtonWithIcon
      v-for="scheme in supportedColorSchemes"
      :key="scheme"
      :icon="faCircleHalfStroke"
      :text="`Switch to ${scheme} scheme`"
      @click="colorSchemeStore.switchSchemeTo(scheme)"
      :disabled="colorSchemeStore.colorScheme == scheme"
      :id="`scheme-switch-${scheme}`"
    ></ButtonWithIcon>
  </div>
</template>

<style lang="scss" scoped>
.buttons {
  display: flex;
  flex-direction: column;
}
</style>
