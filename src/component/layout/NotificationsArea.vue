<script setup lang="ts">
import { StatusBox } from "../index";
import {
  HEIGHT_FADE_DURATION_MS,
  OPACITY_STEP_DURATION_MS,
  useDemessifierGuiNotificationsList,
} from "../../provider/notification";
import { type CSSStyleDeclarationSubset } from "../../provider/css";

type StatusBoxProps = InstanceType<typeof StatusBox>["$props"];
const demessifierGuiNotificationsList = useDemessifierGuiNotificationsList();

function getStyle(id: string): CSSStyleDeclarationSubset {
  const isGone = demessifierGuiNotificationsList.getIsGone(id);
  return {
    opacity: `${demessifierGuiNotificationsList.getOpacityFraction(id)}`,
    transition: `opacity ${OPACITY_STEP_DURATION_MS}ms linear, max-height ${HEIGHT_FADE_DURATION_MS}ms linear`,
    maxHeight: isGone ? "0" : "100rem",
    pointerEvents: isGone ? "none" : "auto",
  };
}
</script>

<template>
  <div id="notifications-backdrop">
    <StatusBox
      v-for="(
        notification, id
      ) in demessifierGuiNotificationsList.notificationsList"
      :key="id"
      v-bind="notification.statusBoxProps as StatusBoxProps"
      @close-status-box="
        () => demessifierGuiNotificationsList.removeNotification(id as string)
      "
      @pin-status-box="
        () => demessifierGuiNotificationsList.interruptCountDown(id as string)
      "
      @mousemove="demessifierGuiNotificationsList.resetTimer(id as string)"
      :style="getStyle(id as string)"
    >
      <component v-for="child in notification.children" :is="child" />
    </StatusBox>
  </div>
</template>

<style lang="scss" scoped>
#notifications-backdrop {
  position: absolute;
  top: 0;
  right: 1em;

  display: flex;
  flex-direction: column;
  align-items: flex-end;
  align-content: flex-end;
  justify-content: flex-start;

  pointer-events: none;

  & > * {
    margin: 1em;
    pointer-events: auto;
    border-radius: 0.5rem;

    &.full {
      background-color: var(--default-bg-color);
    }
  }
}
</style>
