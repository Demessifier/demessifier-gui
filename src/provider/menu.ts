import {
  faCircleHalfStroke,
  faPalette,
  faTable,
} from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

type ModuleType = typeof import("../App.vue");

type Path = `/${string}`;
type PathsList = { [key: string]: Path };

const clientPaths: PathsList = {
  _: "/",
  scheme: "/color-scheme-switch",
  icons: "/font-awesome-icon",
  status: "/status-box",
};

type Keys = keyof typeof clientPaths;
export type ClientPath = (typeof clientPaths)[Keys];

export type MenuItem = {
  name: string;
  component: () => Promise<ModuleType> | any; // TODO: remove any
  componentProps: any; // TODO: remove any
  path: ClientPath;
  title: string;
  fa: IconDefinition;
  metaTitle: string;
};

const MENU_COLORS: MenuItem = {
  name: "ColorPalette",
  component: () => import("../component/global-controller/ColorPalette.vue"),
  componentProps: {},
  path: clientPaths._,
  title: "ColorPalette",
  fa: faPalette,
  metaTitle: "ColorPalette",
};

const MENU_SCHEME: MenuItem = {
  name: "ColorSchemeSwitch",
  component: () =>
    import("../component/global-controller/ColorSchemeSwitch.vue"),
  componentProps: {},
  path: clientPaths.scheme,
  title: "ColorSchemeSwitch",
  fa: faCircleHalfStroke,
  metaTitle: "ColorSchemeSwitch",
};

const MENU_STATUS: MenuItem = {
  name: "StatusBox",
  component: () => import("../component/StatusBox.vue"),
  componentProps: {
    headlineText: "StatusBox",
    boxFlavorName: "success",
  },
  path: clientPaths.status,
  title: "StatusBox",
  fa: faTable,
  metaTitle: "StatusBox",
};

export const MENU = Object.freeze([
  MENU_COLORS,
  MENU_SCHEME,
  MENU_STATUS,
] as MenuItem[]);
