<script setup lang="ts">
import LogoSvg from "../../graphics/sbrul-shad-svg-v1.svg";

const cssMaskUrl = `url(${LogoSvg})`;
</script>

<template>
  <div class="logo-wrapper">
    <div class="logo-img"></div>
    <div class="logo-text">Demessifier</div>
  </div>
</template>

<style lang="scss" scoped>
.logo-wrapper {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  background-color: var(--color-primary);
  width: fit-content;
  height: 100%;
  aspect-ratio: 1 / 1;
}

.logo-img {
  height: 100%;
  aspect-ratio: 1 / 1;
  background-color: var(--color-primary-complement);
  -webkit-mask-image: v-bind(cssMaskUrl);
  mask-image: v-bind(cssMaskUrl);
  -webkit-mask-size: contain;
  mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-position-x: center;
  mask-position: center;
}

.logo-text {
  //font-family: ;
}
</style>
