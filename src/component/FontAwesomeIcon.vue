<script setup lang="ts">
import {
  FontAwesomeIcon as FontAwesomeIconOriginal,
  FontAwesomeIconProps,
} from "@fortawesome/vue-fontawesome";
import { FaIcon, getIconObject } from "../provider/fa-icon";

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
