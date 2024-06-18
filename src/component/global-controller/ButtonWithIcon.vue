<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { type IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { computed, type ComputedRef } from "vue";

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
   * Button type attribute.
   */
  type?: "button" | "reset" | "submit";
  /**
   * Optional on-click function.
   */
  onClick?: () => undefined;
}

const props = withDefaults(defineProps<Props>(), {
  type: "button",
});

const hideIcon: ComputedRef<boolean> = computed(() => !props.icon);
const hideText: ComputedRef<boolean> = computed(() => !props.text?.length);
</script>

<template>
  <button :type="props.type" @click="onClick">
    <FontAwesomeIcon
      class="square"
      v-if="!hideIcon"
      :icon="props.icon as IconDefinition"
    />
    <span v-if="hideIcon && hideText">&nbsp;</span>
    <span v-if="!hideText">{{ props.text }}</span>
  </button>
</template>
