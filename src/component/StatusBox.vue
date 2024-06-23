<script setup lang="ts">
import { computed, ComputedRef, Ref, ref, watch } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  statusBoxFlavor,
  StatusBoxFlavorItem,
  StatusBoxFlavorName,
} from "../provider/status-box";
import { faCircleXmark, faThumbTack } from "@fortawesome/free-solid-svg-icons";

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
  /**
   * After this time, the box is removed.
   */
  removeInSeconds?: false | number;
  /**
   * Whether it can be closed.
   */
  closable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  initializeMinimized: false,
  removeInSeconds: false,
  closable: false,
});

const emit = defineEmits(["close-status-box"]);

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

function destroyComponent() {
  // has to be handled by the parent
  emit("close-status-box");
}

const maxTimeSeconds: Ref<number> = ref(
  props.removeInSeconds === false
    ? Infinity
    : Math.max(props.removeInSeconds, 0),
);
const fadeOutDurationSeconds = 5;
const stepDurationMs = 500;
const remainingTimeSeconds: Ref<number> = ref(maxTimeSeconds.value);
const pinned: ComputedRef<boolean> = computed(
  () => remainingTimeSeconds.value === Infinity,
);
const opacityFraction: ComputedRef<number> = computed(() =>
  remainingTimeSeconds.value > fadeOutDurationSeconds
    ? 1
    : remainingTimeSeconds.value /
      Math.min(maxTimeSeconds.value, fadeOutDurationSeconds),
);

type Interval = ReturnType<typeof setInterval>;
const interval: Interval | null =
  maxTimeSeconds.value === Infinity
    ? null
    : setInterval(() => {
        if (remainingTimeSeconds.value > 0) {
          remainingTimeSeconds.value -= stepDurationMs / 1000;
          return;
        }
        clearInterval(interval as Interval);
        destroyComponent();
      }, stepDurationMs);

function resetTimer() {
  remainingTimeSeconds.value = maxTimeSeconds.value;
}

function interruptCountDown() {
  if (interval !== null) clearInterval(interval);
  maxTimeSeconds.value = Infinity;
  resetTimer();
}

const opacity: Ref<number> = ref(1);
watch(opacityFraction, async (newOpacity: number, _oldOpacity: number) => {
  opacity.value = newOpacity;
});
</script>

<template>
  <div
    class="status-box"
    :class="{ minimized: minimized, full: !minimized }"
    :title="minimized ? unMinimizeTooltip : ''"
    @click="unMinimize"
    @mousemove="resetTimer"
  >
    <div class="buttons" v-if="!minimized && (closable || !pinned)">
      <span class="icon-button"
        ><FontAwesomeIcon
          v-if="!pinned"
          :icon="faThumbTack"
          @click="interruptCountDown"
          title="Pin"
        ></FontAwesomeIcon
      ></span>
      <span class="spring"></span>
      <span class="icon-button"
        ><FontAwesomeIcon
          v-if="closable"
          :icon="faCircleXmark"
          @click="destroyComponent"
          title="Close"
        ></FontAwesomeIcon
      ></span>
    </div>
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

  gap: 1em;
  padding: 1em;
  border: 2px solid v-bind(boxBgColor);
  height: fit-content;
  width: fit-content;
  transition:
    width 300ms ease,
    height 300ms ease; /* doesn't work with fit-content */
  opacity: v-bind(opacity);

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

  div.buttons {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;

    color: v-bind(boxBgColor);

    span {
      padding: -1em 0 0 0;

      &.spring {
        width: 100%;
      }

      &.icon-button {
        cursor: pointer;

        &:hover {
          color: initial;
        }
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
}
</style>
