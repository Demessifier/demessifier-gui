<script setup lang="ts">
import { ref } from "vue";
import FontAwesomeIcon from "../FontAwesomeIcon.vue";
import {
  supportedColorSchemes,
  getColorSchemeConfiguredOrPreferred,
  Scheme,
  setColorScheme,
} from "../../provider/color-scheme";

const preferredColorScheme = ref(getColorSchemeConfiguredOrPreferred());
setColorScheme(preferredColorScheme.value);

function switchSchemeTo(scheme: Scheme) {
  preferredColorScheme.value = scheme;
  setColorScheme(preferredColorScheme.value);
}
</script>

<template>
  <div class="buttons">
    <button
      v-for="scheme in supportedColorSchemes"
      :key="scheme"
      type="button"
      @click="switchSchemeTo(scheme)"
      :disabled="preferredColorScheme == scheme"
      :id="`scheme-switch-${scheme}`"
    >
      <FontAwesomeIcon icon="fas-circle-half-stroke" />
      Switch to {{ scheme }} scheme
    </button>
  </div>
</template>

<style scoped>
.buttons {
  display: flex;
  flex-direction: column;

  & div {
  }
}
</style>
