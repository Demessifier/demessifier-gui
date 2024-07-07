<script setup lang="ts">
import { type IconDefinition } from "@fortawesome/fontawesome-svg-core";
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
  disabled?: boolean;
  /**
   * Whether the target address will be open in a new browser tab or the same one.
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
  display: inline-block;
}

a.disabled {
  pointer-events: unset;

  &:hover {
    cursor: not-allowed;
  }
}
</style>
