<script setup lang="ts">
import { ref } from "vue";
import FontAwesomeIcon from "./FontAwesomeIcon.vue";

interface Props {
  headerText: string;
  initializeMinimized: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  initializeMinimized: false,
});

const unMinimizeTooltip = `Show: \n${props.headerText}`;
const minimized = ref(props.initializeMinimized);

function switchMinimized() {
  minimized.value = !minimized.value;
}

function unMinimize() {
  minimized.value = false;
}
</script>

<template>
  <div
    class="status-box"
    :style="{
      'background-color': 'DarkBlue',
      color: 'white',
    }"
    :class="{ minimized: minimized, full: !minimized }"
    :title="minimized ? unMinimizeTooltip : ''"
    @click="unMinimize"
  >
    <h3
      :title="minimized ? unMinimizeTooltip : 'Minimize'"
      @click.stop="switchMinimized"
    >
      <FontAwesomeIcon icon="fas-circle-info"></FontAwesomeIcon>
      <span v-if="!minimized">{{ headerText }}</span>
    </h3>
    <div v-if="!minimized">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.status-box {
  padding: 1em;
  border: 2px solid;
  border-radius: 0.5em;
  /*background-color: v-bind('`var(--${boxType.bgColor})`');*/
  /*color: v-bind('`var(--${boxType.color})`');*/
  height: fit-content;
  width: fit-content;
  transition:
    width 1s,
    height 1s; /* doesn't work with fit-content */

  &.minimized {
    width: fit-content;
    cursor: pointer;
  }

  &.full {
    width: auto;

    h3 {
      cursor: pointer;
    }
  }

  h3 {
    width: fit-content;

    span {
      padding: 0 0.5em;
    }
  }
}
</style>
