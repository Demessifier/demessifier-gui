<script setup lang="ts">
import { defineStore } from "pinia";
import { faCircleHalfStroke } from "@fortawesome/free-solid-svg-icons";
import {
  supportedColorSchemes,
  getColorSchemeConfiguredOrPreferred,
  type Scheme,
  setColorScheme,
  setDefaultBackgroundColor,
  getColorSchemeDefaultBackgroundColor,
} from "../../provider/color-scheme";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

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
    reapplyScheme() {
      this.switchSchemeTo(this.colorScheme);
    },
  },
});

const colorSchemeStore = useDemessifierGuiColorScheme();
colorSchemeStore.reapplyScheme();
</script>

<template>
  <label>
    <FontAwesomeIcon :icon="faCircleHalfStroke" />
    &nbsp; Color scheme:
    <select
      v-model="colorSchemeStore.colorScheme"
      @change="colorSchemeStore.reapplyScheme()"
    >
      <option
        v-for="scheme in supportedColorSchemes"
        :key="scheme"
        :value="scheme"
      >
        {{ scheme }}
      </option>
    </select>
  </label>
</template>

<style lang="scss" scoped>
.buttons {
  display: flex;
  flex-direction: column;
}
</style>
