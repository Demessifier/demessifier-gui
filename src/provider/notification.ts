import StatusBox from "../component/StatusBox.vue";
import { defineStore } from "pinia";
import { h, type VNode } from "vue";
import { type StatusBoxFlavorName } from "./status-box";
import { getPseudoRandomString } from "./randomness";

type StatusBoxProps = InstanceType<typeof StatusBox>["$props"];
type ChildrenType = string | string[] | VNode | VNode[];
type Interval = ReturnType<typeof setInterval>;

function renderChildren(children?: ChildrenType): VNode[] {
  if (!children) return [];
  if (typeof children === "string") {
    console.log([h("p", {}, children)]);
    return [h("p", {}, children)];
  }
  if (Array.isArray(children)) {
    if (typeof children[0] === "string") {
      if (children.every((child) => typeof child === "string")) {
        console.log(children.map((child) => h("p", {}, child)));
        return children.map((child) => h("p", {}, child));
      }
      throw new Error(
        "Some of the elements of this array are strings and some are not.",
      );
    }
    console.log(children);
    return children as VNode[];
  }
  console.log([children]);
  return [children as VNode];
  // throw new Error(`Unexpected type of children '${typeof children}'.`);
}

type Notification = {
  statusBoxProps: StatusBoxProps;
  children: VNode[];
  interval: Interval;
  maxTimeSeconds: number;
  remainingTimeSeconds: number;
  isGone: boolean;
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

export const OPACITY_STEP_DURATION_MS = 500;
const FADE_OUT_DURATION_S = 5;
export const HEIGHT_FADE_DURATION_MS = 500;

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
        canBePinned: true,
        canBeClosed: true,
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
        if (!notification) {
          // notification already removed, but the interval is still ticking
          clearInterval(interval);
          return;
        }
        if (notification.remainingTimeSeconds > 0) {
          notification.remainingTimeSeconds -= OPACITY_STEP_DURATION_MS / 1000;
          return;
        }
        this.removeNotification(notificationId);
      }, OPACITY_STEP_DURATION_MS);

      const maxTimeSeconds =
        removeInSeconds === false ? Infinity : Math.max(removeInSeconds, 0);
      this.notificationsList[notificationId] = {
        statusBoxProps: props,
        children: renderChildren(children),
        interval: interval,
        maxTimeSeconds: maxTimeSeconds,
        remainingTimeSeconds: maxTimeSeconds,
        isGone: false,
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
        toBeDeleted.isGone = true;
        setTimeout(() => {
          delete this.notificationsList[notificationId];
        }, HEIGHT_FADE_DURATION_MS);
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
      notification.statusBoxProps.canBePinned = false;
      this.resetTimer(notificationId);
    },
    resetTimer(notificationId: string) {
      const notification = this.notificationsList[notificationId];
      notification.remainingTimeSeconds = notification.maxTimeSeconds;
    },
    getOpacityFraction(notificationId: string): number {
      const notification = this.notificationsList[notificationId];
      if (notification.isGone) return 0;
      const remainingTimeSeconds = notification.remainingTimeSeconds;
      if (remainingTimeSeconds > FADE_OUT_DURATION_S) return 1;
      return (
        remainingTimeSeconds /
        Math.min(notification.maxTimeSeconds, FADE_OUT_DURATION_S)
      );
    },
    getIsGone(notificationId: string): boolean {
      const notification = this.notificationsList[notificationId];
      return notification.isGone;
    },
  },
});

export type DemessifierGuiNotificationsList = ReturnType<
  typeof useDemessifierGuiNotificationsList
>;
