import {
  faCircleDot,
  faCircleHalfStroke,
  faPalette,
  faTable,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import ColorSchemeSwitch from "../component/global-controller/ColorSchemeSwitch.vue";
import StatusBox from "../component/StatusBox.vue";
import ColorPalette from "../component/global-controller/ColorPalette.vue";
import ButtonWithIcon from "../component/global-controller/ButtonWithIcon.vue";
import { createNotification } from "./notification";

export type Path = `/${string}`;
export type PathsList = { [key: string]: Path };

const clientPaths: PathsList = {
  _: "/",
  scheme: "/color-scheme-switch",
  status: "/status-box",
  iconButton: "/button-with-icon",
};

type Keys = keyof typeof clientPaths;
export type ClientPath = (typeof clientPaths)[Keys];

export type MenuItemComponentDefinition = {
  new (...args: any[]): { $props: any };
};

export type MenuItem<C extends MenuItemComponentDefinition> = {
  name: string;
  component: () => Promise<C>; // using this should cause generating separate chunks and lazy loading them: component: () => import('../views/ExampleView.vue')
  componentProps: InstanceType<C>["$props"];
  path: ClientPath;
  title: string;
  fa: IconDefinition;
  metaTitle: string;
};

export type MenuItemAny = MenuItem<MenuItemComponentDefinition>;

const MENU_COLORS: MenuItem<typeof ColorPalette> = {
  name: "ColorPalette",
  component: async () => ColorPalette,
  componentProps: {},
  path: clientPaths._,
  title: "ColorPalette",
  fa: faPalette,
  metaTitle: "ColorPalette",
};

const MENU_SCHEME: MenuItem<typeof ColorSchemeSwitch> = {
  name: "ColorSchemeSwitch",
  component: async () => ColorSchemeSwitch,
  componentProps: {},
  path: clientPaths.scheme,
  title: "ColorSchemeSwitch",
  fa: faCircleHalfStroke,
  metaTitle: "ColorSchemeSwitch",
};

const MENU_STATUS: MenuItem<typeof StatusBox> = {
  name: "StatusBox",
  component: async () => StatusBox,
  componentProps: {
    headlineText: "StatusBox",
    boxFlavorName: "success",
  },
  path: clientPaths.status,
  title: "StatusBox",
  fa: faTable,
  metaTitle: "StatusBox",
};

const MENU_ICON_BUTTON: MenuItem<typeof ButtonWithIcon> = {
  name: "ButtonWithIcon",
  component: async () => ButtonWithIcon,
  componentProps: {
    text: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Mauris tincidunt sem sed arcu. Sed ac dolor sit amet purus malesuada congue. Etiam neque. Nullam faucibus mi quis velit. Integer rutrum, orci vestibulum ullamcorper ultricies, lacus quam ultricies odio, vitae placerat pede sem sit amet enim. Aenean placerat. Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur? Fusce dui leo, imperdiet in, aliquam sit amet, feugiat eu, orci.",
    icon: faCircleDot,
    onClick: () => {
      createNotification(
        "warn",
        "Notification example",
        "Example text.",
        // createVNode(ButtonWithIcon, { text: "Text", icon: faCircleDot }),
      );
    },
  },
  path: clientPaths.iconButton,
  title: "ButtonWithIcon",
  fa: faCircleDot,
  metaTitle: "ButtonWithIcon",
};

export const menuExample: MenuItemAny[] = [
  MENU_COLORS,
  MENU_SCHEME,
  MENU_STATUS,
  MENU_ICON_BUTTON,
];
