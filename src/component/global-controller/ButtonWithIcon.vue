<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface Props {
  /**
   * Icon of the button.
   */
  icon: IconDefinition;
  /**
   * Text of the button.
   */
  text: string;
  /**
   * Optional on-click function.
   */
  onClick?: () => undefined;
}

const props = defineProps<Props>();
</script>

<template>
  <button type="button" @click="onClick">
    <FontAwesomeIcon :icon="props.icon" />
    <span>{{ props.text }}</span>
  </button>
</template>
