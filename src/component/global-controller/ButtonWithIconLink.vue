<script setup lang="ts">
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import ButtonWithIcon from "./ButtonWithIcon.vue";

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
   * Target address.
   */
  href: string;
  /**
   * Optional on-click redirect address.
   */
  openInNewTab?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  openInNewTab: false,
});
</script>

<template>
  <a
    class="button-wrapper"
    :href="props.href"
    :target="props.openInNewTab ? '_blank' : undefined"
    :rel="props.openInNewTab ? 'noreferrer noopener' : undefined"
  >
    <ButtonWithIcon :icon="props.icon" :text="props.text" />
  </a>
</template>

<style lang="scss" scoped>
a.button-wrapper {
  text-decoration: none;
}
</style>
