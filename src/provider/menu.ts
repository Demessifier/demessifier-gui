import {
  faCircleHalfStroke,
  faIcons,
  faLink,
  faPalette,
  faTable,
} from "@fortawesome/free-solid-svg-icons";
import { type IconDefinition } from "@fortawesome/fontawesome-svg-core";
import ColorSchemeSwitch from "../component/global-controller/ColorSchemeSwitch.vue";
import StatusBox from "../component/StatusBox.vue";
import ColorPalette from "../component/global-controller/ColorPicker.vue";
import ButtonWithIconShowcase from "../component/layout/ButtonWithIconShowcase.vue";
import { ButtonWithIconLink } from "../component";

export type Path = `/${string}`;
export type PathsList = { [key: string]: Path };

const clientPaths: PathsList = {
  _: "/",
  scheme: "/color-scheme-switch",
  status: "/status-box",
  iconButton: "/button-with-icon",
  iconButtonLink: "/button-with-icon-link",
};

type Keys = keyof typeof clientPaths;
export type ClientPath = (typeof clientPaths)[Keys];

export type MenuItemComponentDefinition = new (...args: any[]) => {
  $props: any;
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

const MENU_ICON_BUTTON: MenuItem<typeof ButtonWithIconShowcase> = {
  name: "ButtonWithIcon",
  component: async () => ButtonWithIconShowcase,
  componentProps: {} as InstanceType<typeof ButtonWithIconShowcase>["$props"],
  path: clientPaths.iconButton,
  title: "ButtonWithIcon",
  fa: faIcons,
  metaTitle: "ButtonWithIcon",
};

const MENU_ICON_BUTTON_LINK: MenuItem<typeof ButtonWithIconLink> = {
  name: "ButtonWithIconLink",
  component: async () => ButtonWithIconLink,
  componentProps: {
    icon: faLink,
    text: "I'm a link, but I look like a button",
    href: "#",
    openInNewTab: true,
  } as InstanceType<typeof ButtonWithIconLink>["$props"],
  path: clientPaths.iconButtonLink,
  title: "ButtonWithIconLink",
  fa: faLink,
  metaTitle: "ButtonWithIcon",
};

export const menuExample: MenuItemAny[] = [
  MENU_COLORS,
  MENU_SCHEME,
  MENU_STATUS,
  MENU_ICON_BUTTON,
  MENU_ICON_BUTTON_LINK,
];
