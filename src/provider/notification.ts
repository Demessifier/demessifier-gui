import StatusBox from "../component/StatusBox.vue";
import { defineStore } from "pinia";
import { type VNode } from "vue";
import { type StatusBoxFlavorName } from "./status-box";
import { getPseudoRandomString } from "./randomness";

type StatusBoxProps = InstanceType<typeof StatusBox>["$props"];
type ChildrenType = string | VNode | VNode[];
type Interval = ReturnType<typeof setInterval>;

type Notification = {
  statusBoxProps: StatusBoxProps;
  interval: Interval;
  maxTimeSeconds: number;
  remainingTimeSeconds: number;
};
type NotificationsList = { [key: string]: Notification };

function getLogItems(
  props: StatusBoxProps,
  children: ChildrenType,
): [string, ChildrenType, string, StatusBoxProps] {
  const flavor = props.boxFlavorName;
  const capitalisedFlavor = `${flavor.charAt(0).toUpperCase()}${flavor.slice(1).toLowerCase()}`;
  return [
    `${capitalisedFlavor} notification:\n${props.headlineText}\n`,
    children,
    "\n",
    props,
  ];
}

const fadeOutDurationSeconds = 5;
const stepDurationMs = 500;

export const useDemessifierGuiNotificationsList = defineStore({
  id: "demessifier-gui:notifications-list",
  state: () => {
    return {
      notificationsList: {} as NotificationsList,
    };
  },
  actions: {
    addNewNotification(
      boxFlavorName: StatusBoxFlavorName,
      headlineText: string,
      children: ChildrenType,
      removeInSeconds: number | false = 10,
    ): string {
      const props: StatusBoxProps = {
        boxFlavorName,
        headlineText,
        fading: true,
        closable: true,
      };
      const notificationId = getPseudoRandomString(32);

      switch (props.boxFlavorName) {
        case "warn":
          console.warn(...getLogItems(props, children));
          break;
        case "error":
          console.error(...getLogItems(props, children));
          break;
      }
      const interval = setInterval(() => {
        const notification = this.notificationsList[notificationId];
        if (!notification) return; // TODO: when does this happen?
        if (notification.remainingTimeSeconds > 0) {
          notification.remainingTimeSeconds -= stepDurationMs / 1000;
          return;
        }
        clearInterval(interval as Interval);
        delete this.notificationsList[notificationId];
      }, stepDurationMs);

      const maxTimeSeconds =
        removeInSeconds === false ? Infinity : Math.max(removeInSeconds, 0);
      this.notificationsList[notificationId] = {
        statusBoxProps: props,
        interval: interval,
        maxTimeSeconds: maxTimeSeconds,
        remainingTimeSeconds: maxTimeSeconds,
      };
      return notificationId;
    },
    removeNotification(
      notificationId: string,
      ignoreMissing: boolean = false,
    ): StatusBoxProps | null {
      if (notificationId in this.notificationsList) {
        const toBeDeleted = this.notificationsList[notificationId];
        clearInterval(toBeDeleted.interval);
        delete this.notificationsList[notificationId];
        return toBeDeleted.statusBoxProps;
      }
      if (ignoreMissing) return null;
      throw new Error(
        `Notification ID ${notificationId} is not in the notifications list.`,
      );
    },
    interruptCountDown(notificationId: string) {
      const notification = this.notificationsList[notificationId];
      if (notification.interval !== null) {
        clearInterval(notification.interval);
      }
      notification.maxTimeSeconds = Infinity;
      notification.statusBoxProps.fading = false;
      this.resetTimer(notificationId);
    },
    resetTimer(notificationId: string) {
      const notification = this.notificationsList[notificationId];
      notification.remainingTimeSeconds = notification.maxTimeSeconds;
    },
    getOpacityFraction(notificationId: string) {
      const notification = this.notificationsList[notificationId];
      const remainingTimeSeconds = notification.remainingTimeSeconds;
      if (remainingTimeSeconds > fadeOutDurationSeconds) return 1;
      return (
        remainingTimeSeconds /
        Math.min(notification.maxTimeSeconds, fadeOutDurationSeconds)
      );
    },
  },
});

export type DemessifierGuiNotificationsList = ReturnType<
  typeof useDemessifierGuiNotificationsList
>;
