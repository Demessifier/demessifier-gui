<script setup lang="ts">
import { ref, type Ref } from "vue";
import { StatusBox } from "./component";
import { useDemessifierGuiNotificationsList } from "./provider/notification";

type StatusBoxProps = InstanceType<typeof StatusBox>["$props"];
const demessifierGuiNotificationsList = useDemessifierGuiNotificationsList();

type NotificationDefinition = {
  statusBoxProps: StatusBoxProps;
};

const notificationsList: Ref<NotificationDefinition[]> = ref([]);
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
    ></StatusBox>
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
    // TODO: transition: `opacity ${stepDurationMs}ms linear`;
    &.full {
      background-color: var(--default-bg-color);
    }
  }
}
</style>
