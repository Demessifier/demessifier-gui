import StatusBox from "../component/StatusBox.vue";
import { defineStore } from "pinia";
import { type VNode } from "vue";
import { type StatusBoxFlavorName } from "./status-box";
import { getRandomBase64String } from "./randomness";

type StatusBoxProps = InstanceType<typeof StatusBox>["$props"];
type ChildrenType = string | VNode | VNode[];

type Notification = {
  statusBoxProps: StatusBoxProps;
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
    ): string {
      const props: StatusBoxProps = {
        boxFlavorName,
        headlineText,
        removeInSeconds: 10,
        closable: true,
      };
      const randomId = getRandomBase64String(24);

      switch (props.boxFlavorName) {
        case "warn":
          console.warn(...getLogItems(props, children));
          break;
        case "error":
          console.error(...getLogItems(props, children));
          break;
      }

      this.notificationsList[randomId] = {
        statusBoxProps: props,
      };
      return randomId;
    },
    removeNotification(
      idToDelete: string,
      ignoreMissing: boolean = false,
    ): StatusBoxProps | null {
      if (idToDelete in this.notificationsList) {
        const toBeDeleted = this.notificationsList[idToDelete];
        delete this.notificationsList[idToDelete];
        return toBeDeleted.statusBoxProps;
      }
      if (ignoreMissing) return null;
      throw new Error(
        `Notification ID ${idToDelete} is not in the notifications list.`,
      );
    },
  },
});
