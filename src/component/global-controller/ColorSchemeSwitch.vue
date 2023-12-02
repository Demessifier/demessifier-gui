<script setup lang="ts">
import { ref } from "vue";
import FontAwesomeIcon from "../FontAwesomeIcon.vue";
import {
  colorSchemes,
  getPreferredColorScheme,
  Scheme,
  setColorScheme,
} from "../../provider/color-scheme";

const preferredColorScheme = ref(getPreferredColorScheme());
setColorScheme(preferredColorScheme.value);

function switchSchemeTo(scheme: Scheme) {
  preferredColorScheme.value = scheme;
  setColorScheme(preferredColorScheme.value);
}
</script>

<template>
  <div class="buttons">
    <button
      v-for="scheme in colorSchemes"
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
