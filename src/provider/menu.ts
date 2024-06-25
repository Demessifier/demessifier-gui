import {
  faCircleHalfStroke,
  faIcons,
  faPalette,
  faTable,
} from "@fortawesome/free-solid-svg-icons";
import { type IconDefinition } from "@fortawesome/fontawesome-svg-core";
import ColorSchemeSwitch from "../component/global-controller/ColorSchemeSwitch.vue";
import StatusBox from "../component/StatusBox.vue";
import ColorPalette from "../component/global-controller/ColorPalette.vue";
import ButtonWithIconShowcase from "../component/layout/ButtonWithIconShowcase.vue";

type Path = `/${string}`;
type PathsList = { [key: string]: Path };

const clientPaths: PathsList = {
  _: "/",
  scheme: "/color-scheme-switch",
  status: "/status-box",
  iconButton: "/button-with-icon",
};

type Keys = keyof typeof clientPaths;
export type ClientPath = (typeof clientPaths)[Keys];

export type MenuItem = {
  name: string;
  component: () => Promise<any>; // TODO: replace any with Vue component type
  componentProps: any; // TODO: replace any with the Props type of the given component
  path: ClientPath;
  title: string;
  fa: IconDefinition;
  metaTitle: string;
};

const MENU_COLORS: MenuItem = {
  name: "ColorPalette",
  component: async () => ColorPalette,
  componentProps: {} as InstanceType<typeof ColorPalette>["$props"],
  path: clientPaths._,
  title: "ColorPalette",
  fa: faPalette,
  metaTitle: "ColorPalette",
};

const MENU_SCHEME: MenuItem = {
  name: "ColorSchemeSwitch",
  component: async () => ColorSchemeSwitch,
  componentProps: {} as InstanceType<typeof ColorSchemeSwitch>["$props"],
  path: clientPaths.scheme,
  title: "ColorSchemeSwitch",
  fa: faCircleHalfStroke,
  metaTitle: "ColorSchemeSwitch",
};

const MENU_STATUS: MenuItem = {
  name: "StatusBox",
  component: async () => StatusBox,
  componentProps: {
    headlineText: "StatusBox",
    boxFlavorName: "success",
  } as InstanceType<typeof StatusBox>["$props"],
  path: clientPaths.status,
  title: "StatusBox",
  fa: faTable,
  metaTitle: "StatusBox",
};

const MENU_ICON_BUTTON: MenuItem = {
  name: "ButtonWithIcon",
  component: async () => ButtonWithIconShowcase,
  componentProps: {} as InstanceType<typeof ButtonWithIconShowcase>["$props"],
  path: clientPaths.iconButton,
  title: "ButtonWithIcon",
  fa: faIcons,
  metaTitle: "ButtonWithIcon",
};

export const MENU = Object.freeze([
  MENU_COLORS,
  MENU_SCHEME,
  MENU_STATUS,
  MENU_ICON_BUTTON,
] as MenuItem[]);
