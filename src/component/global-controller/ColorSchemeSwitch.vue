<script setup lang="ts">
import { ref } from "vue";
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

const preferredColorScheme = ref(getColorSchemeConfiguredOrPreferred());

function switchSchemeTo(scheme: Scheme) {
  preferredColorScheme.value = scheme;
  setColorScheme(preferredColorScheme.value);
  setDefaultBackgroundColor(getColorSchemeDefaultBackgroundColor(scheme));
}

switchSchemeTo(preferredColorScheme.value);
</script>

<template>
  <div class="buttons">
    <ButtonWithIcon
      v-for="scheme in supportedColorSchemes"
      :key="scheme"
      :icon="faCircleHalfStroke"
      :text="`Switch to ${scheme} scheme`"
      @click="switchSchemeTo(scheme)"
      :disabled="preferredColorScheme == scheme"
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
