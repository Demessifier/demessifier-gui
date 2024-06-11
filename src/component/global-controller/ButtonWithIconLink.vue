<script setup lang="ts">
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import ButtonWithIcon from "./ButtonWithIcon.vue";

interface Props {
  /**
   * Icon of the button.
   */
  icon?: IconDefinition | null;
  /**
   * Text of the button.
   */
  text: string;
  /**
   * Target address.
   */
  href: string;
  /**
   * Is the button and link disabled?
   */
  disabled: boolean;
  /**
   * Optional on-click redirect address.
   */
  openInNewTab?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  openInNewTab: false,
});
</script>

<template>
  <a
    class="button-wrapper"
    :class="{ disabled: props.disabled }"
    :href="props.href"
    :target="props.openInNewTab ? '_blank' : undefined"
    :rel="props.openInNewTab ? 'noreferrer noopener' : undefined"
  >
    <ButtonWithIcon
      :icon="props.icon"
      :text="props.text"
      :disabled="props.disabled"
    />
  </a>
</template>

<style lang="scss" scoped>
a.button-wrapper {
  text-decoration: none;
}

a.disabled {
  pointer-events: unset;

  &:hover {
    cursor: not-allowed;
  }
}
</style>
