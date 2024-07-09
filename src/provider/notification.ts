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
  maxTimeMilliSeconds: number;
  remainingTimeMilliSeconds: number;
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
export const FADE_OUT_DURATION_MS = 5 * 1000;
export const REMOVE_IN_MS = 10 * 1000;
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
      removeInMilliSeconds: number | false = REMOVE_IN_MS,
    ): string {
      const props: StatusBoxProps = {
        boxFlavorName,
        headlineText,
        canBePinned: removeInMilliSeconds !== false,
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
        if (notification.remainingTimeMilliSeconds > 0) {
          notification.remainingTimeMilliSeconds -= OPACITY_STEP_DURATION_MS;
          return;
        }
        this.removeNotification(notificationId);
      }, OPACITY_STEP_DURATION_MS);

      const maxTimeMilliSeconds =
        removeInMilliSeconds === false
          ? Infinity
          : Math.max(removeInMilliSeconds, 0);
      this.notificationsList[notificationId] = {
        statusBoxProps: props,
        children: renderChildren(children),
        interval: interval,
        maxTimeMilliSeconds: maxTimeMilliSeconds,
        remainingTimeMilliSeconds: maxTimeMilliSeconds,
        isGone: false,
      };
      return notificationId;
    },
    removeNotification(notificationId: string, ignoreMissing: boolean = true) {
      if (notificationId in this.notificationsList) {
        const toBeDeleted = this.notificationsList[notificationId];
        if (!toBeDeleted) return null;
        clearInterval(toBeDeleted.interval);
        toBeDeleted.isGone = true;
        setTimeout(() => {
          delete this.notificationsList[notificationId];
        }, HEIGHT_FADE_DURATION_MS);
        return;
      }
      if (ignoreMissing) return;
      throw new Error(
        `Notification ID ${notificationId} is not in the notifications list.`,
      );
    },
    interruptCountDown(notificationId: string) {
      const notification = this.notificationsList[notificationId];
      if (!notification) return;
      if (notification.interval !== null) {
        clearInterval(notification.interval);
      }
      notification.maxTimeMilliSeconds = Infinity;
      notification.statusBoxProps.canBePinned = false;
      this.resetTimer(notificationId);
    },
    resetTimer(notificationId: string) {
      const notification = this.notificationsList[notificationId];
      if (!notification) return;
      notification.remainingTimeMilliSeconds = notification.maxTimeMilliSeconds;
    },
    getOpacityFraction(notificationId: string): number {
      const notification = this.notificationsList[notificationId];
      if (!notification || notification.isGone) return 0;
      const remainingTimeMilliSeconds = notification.remainingTimeMilliSeconds;
      if (remainingTimeMilliSeconds > FADE_OUT_DURATION_MS) return 1;
      return (
        remainingTimeMilliSeconds /
        Math.min(notification.maxTimeMilliSeconds, FADE_OUT_DURATION_MS)
      );
    },
    getIsGone(notificationId: string): boolean {
      const notification = this.notificationsList[notificationId];
      if (!notification) return true;
      return notification.isGone;
    },
  },
});

export type DemessifierGuiNotificationsList = ReturnType<
  typeof useDemessifierGuiNotificationsList
>;
