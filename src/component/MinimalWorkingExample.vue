<script setup lang="ts">
interface Props {
  headerText: string;
}

const props = defineProps<Props>();
</script>

<template>
  <div>
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped></style>
