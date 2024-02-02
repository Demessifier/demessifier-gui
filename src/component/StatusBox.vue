<script setup lang="ts">
import { computed, ref } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  statusBoxFlavor,
  StatusBoxFlavorItem,
  StatusBoxFlavorName,
} from "../provider/status-box";

interface Props {
  /**
   * Headline of the box.
   * This is shown in the tooltip when the box is minimized.
   */
  headlineText: string;
  /**
   * Determines color and icon of the box.
   */
  boxFlavorName: StatusBoxFlavorName;
  initializeMinimized?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  initializeMinimized: false,
});

const boxType: StatusBoxFlavorItem = statusBoxFlavor[props.boxFlavorName];
const unMinimizeTooltip = `Expand: \n${props.headlineText}`;
const minimized = ref(props.initializeMinimized);
const boxColor = computed(() => `var(--${boxType.color})`);
const boxBgColor = computed(() => `var(--${boxType.bgColor})`);

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
    :class="{ minimized: minimized, full: !minimized }"
    :title="minimized ? unMinimizeTooltip : ''"
    @click="unMinimize"
  >
    <div
      class="header"
      @click.stop="switchMinimized"
      :title="minimized ? unMinimizeTooltip : 'Minimize'"
    >
      <h3>
        <FontAwesomeIcon :icon="boxType.icon" />
        <span v-if="!minimized">{{ headlineText }}</span>
      </h3>
    </div>
    <div class="content" v-if="!minimized && $slots.default">
      <!-- @slot Contents of the box. -->
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.status-box {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;

  padding: 1em;
  border: 2px solid v-bind(boxBgColor);
  border-radius: 0.5rem;
  height: fit-content;
  width: fit-content;
  transition:
    width 300ms ease,
    height 300ms ease; /* doesn't work with fit-content */

  &.minimized {
    width: fit-content;
    cursor: pointer;
    background-color: v-bind(boxBgColor);

    div.header {
      h3 {
        margin: 0;
      }
    }
  }

  &.full {
    width: auto;

    div.header {
      cursor: pointer;
      border-radius: 0.25rem;

      h3 {
        padding: 0 1em;
      }
    }
  }

  div.header {
    color: v-bind(boxColor);
    background-color: v-bind(boxBgColor);
    margin: 0;

    h3 {
      transition: all 300ms ease;
      width: fit-content;

      span {
        padding: 0 1em;
      }
    }
  }

  div.content {
    padding-top: 1em;
  }
}
</style>
