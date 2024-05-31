<script setup lang="ts">
import { CSSProperties } from "vue";
import { LogoSection } from "../../model/logo-section";

interface Props {
  logoSections: LogoSection[];
}

const props = defineProps<Props>();

function getSvgMaskStyle(svgMask?: string): CSSProperties | undefined {
  if (!svgMask) {
    console.warn("No SVG mask specified in the logo component.");
    return undefined;
  }
  const urlSvgMask = `url("${svgMask}")`; // use double quotes to work with both path (/src/graphics/logo.svg) and data: (data:image/svg+xml,%3c?xml...)
  return {
    "-webkit-mask-image": urlSvgMask,
    "mask-image": urlSvgMask,
  };
}

function getStyle(component: LogoSection): CSSProperties | undefined {
  switch (component.logoSectionType) {
    case "svg-mask-square":
      return getSvgMaskStyle(component.logoSectionSvgMask);
    default:
      return undefined;
  }
}
</script>

<template>
  <div class="logo-wrapper">
    <div
      v-for="component in props.logoSections"
      :key="JSON.stringify(component)"
      :class="component.logoSectionType"
      :style="getStyle(component)"
    >
      {{
        component.logoSectionType.startsWith("text-")
          ? component.logoSectionText
          : ""
      }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.logo-wrapper {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  background-color: var(--color-primary);
  height: 100%;
  white-space: nowrap;
  overflow: hidden;

  $margin: 15px;
  margin-right: $margin;

  & > * {
    margin-left: $margin;
  }

  & > .svg-mask-square {
    height: 100%;
    aspect-ratio: 1 / 1;
    background-color: var(--color-primary-complement);
    -webkit-mask-size: contain;
    mask-size: contain;
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
    -webkit-mask-position-x: center;
    mask-position: center;
  }

  & > .text-title {
    //font-family: ;
  }

  & > .text-subtitle {
    font-size: 0.5em;
  }
}
</style>
