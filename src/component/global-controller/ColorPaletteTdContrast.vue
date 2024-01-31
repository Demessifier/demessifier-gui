<script setup lang="ts">
import {
  computeColorsContrastRatio,
  HexColorApproximation,
  selectByContrastRatio,
} from "../../provider/color-palette";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { computed, ComputedRef } from "vue";
import { getFlavorItem, StatusBoxFlavorItem } from "../../provider/status-box";

interface Props {
  colorValue: HexColorApproximation;
  otherColorValue: HexColorApproximation;
}

const props = defineProps<Props>();

const contrast: ComputedRef<number> = computed(() =>
  computeColorsContrastRatio(props.colorValue, props.otherColorValue),
);
const flavor: ComputedRef<StatusBoxFlavorItem> = computed(() =>
  getFlavorItem(
    selectByContrastRatio(contrast.value, "success", "warn", "error"),
  ),
);
</script>

<template>
  <td class="contrast" :class="`${flavor.name}`">
    <span>
      <FontAwesomeIcon :icon="flavor.icon" />
      {{ contrast.toFixed(2) }}
    </span>
  </td>
</template>

<style lang="scss" scoped>
$colorNames: success, warn, error;
@each $colorName in $colorNames {
  td.#{$colorName} {
    background-color: var(--color-#{$colorName});

    span {
      color: var(--color-#{$colorName}-complement);
    }
  }
}
</style>
