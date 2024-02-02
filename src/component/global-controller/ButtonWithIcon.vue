<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface Props {
  /**
   * Icon of the button.
   */
  icon: IconDefinition;
  /**
   * Text of the button.
   */
  text: string;
}

const props = defineProps<Props>();
</script>

<template>
  <button type="button">
    <FontAwesomeIcon :icon="props.icon" />
    <span>{{ props.text }}</span>
  </button>
</template>

<style lang="scss" scoped></style>
