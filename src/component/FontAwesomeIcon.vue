<script setup lang="ts">
import { FontAwesomeIcon as FontAwesomeIconOriginal } from "@fortawesome/vue-fontawesome";
import { FaIcon, getIconObject } from "../provider/fa-icon";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface FontAwesomeIconProps {
  border?: boolean;
  fixedWidth?: boolean;
  flip?: "horizontal" | "vertical" | "both";
  icon: object | Array<string> | string | IconDefinition;
  mask?: object | Array<string> | string;
  maskId?: object | Array<string> | string;
  listItem?: boolean;
  pull?: "right" | "left";
  pulse?: boolean;
  rotation?: 90 | 180 | 270 | "90" | "180" | "270";
  swapOpacity?: boolean;
  size?:
    | "2xs"
    | "xs"
    | "sm"
    | "lg"
    | "xl"
    | "2xl"
    | "1x"
    | "2x"
    | "3x"
    | "4x"
    | "5x"
    | "6x"
    | "7x"
    | "8x"
    | "9x"
    | "10x";
  spin?: boolean;
  transform?: object | string;
  symbol?: boolean | string;
  title?: string;
  titleId?: string;
  inverse?: boolean;
  bounce?: boolean;
  shake?: boolean;
  beat?: boolean;
  fade?: boolean;
  beatFade?: boolean;
  spinPulse?: boolean;
  spinReverse?: boolean;
}

// Without the "vue-ignore", this throws the following error during the build:
// [vite:vue] [@vue/compiler-sfc] Failed to resolve extends base type.
// See https://github.com/vuejs/core/issues/8348
interface Props extends /* @vue-ignore */ Omit<FontAwesomeIconProps, "icon"> {
  /**
   * One of the FontAwesome icons added to the library.
   */
  icon: FaIcon; // allow only the imported icons - autocomplete
}

const props = defineProps<Props>();

function filterProps(p: Props): FontAwesomeIconProps {
  const result = JSON.parse(JSON.stringify(p)) as FontAwesomeIconProps;
  result.icon = getIconObject(p.icon);
  return result;
}
</script>

<template>
  <FontAwesomeIconOriginal v-bind="filterProps(props)" />
</template>

<style lang="scss" scoped></style>
