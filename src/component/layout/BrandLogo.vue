<script setup lang="ts">
import LogoSvg from "../../graphics/sbrul-shad-svg-v1.svg";

const cssMaskUrl = `url(${LogoSvg})`;
</script>

<template>
  <div></div>
</template>

<style scoped>
div {
  background-color: var(--color-primary-complement);
  -webkit-mask-image: v-bind(cssMaskUrl);
  mask-image: v-bind(cssMaskUrl);
  -webkit-mask-size: contain;
  mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-position-x: left;
  mask-position: left;
}
</style>
