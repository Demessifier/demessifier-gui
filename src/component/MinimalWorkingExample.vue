<script setup lang="ts">
interface Props {
  headerText: string;
}

const props = defineProps<Props>();
</script>

<template>
  <div>
    <h1>{{ props.headerText}}</h1>
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped></style>
