import StatusBox from "../component/StatusBox.vue";
import { createVNode, render, VNode } from "vue";

type StatusBoxProps = InstanceType<typeof StatusBox>["$props"];
type ChildrenType = string | VNode | VNode[];

function getNotificationsParentElement(): HTMLElement {
  return document.getElementById("notifications-backdrop") as HTMLElement;
}

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

export function createNotification(
  props: StatusBoxProps,
  children: ChildrenType,
) {
  const box = createVNode(StatusBox, props, () => children);
  render(box, getNotificationsParentElement());

  switch (props.boxFlavorName) {
    case "warn":
      console.warn(...getLogItems(props, children));
      break;
    case "error":
      console.error(...getLogItems(props, children));
      break;
  }
}
