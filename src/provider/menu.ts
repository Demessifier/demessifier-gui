import { FaIcon } from "./fa-icon";

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
  fa: FaIcon;
  metaTitle: string;
};

const MENU_COLORS: MenuItem = {
  name: "ColorPalette",
  component: () => import("../component/global-controller/ColorPalette.vue"),
  componentProps: {},
  path: clientPaths._,
  title: "ColorPalette",
  fa: "fas-palette",
  metaTitle: "ColorPalette",
};

const MENU_SCHEME: MenuItem = {
  name: "ColorSchemeSwitch",
  component: () =>
    import("../component/global-controller/ColorSchemeSwitch.vue"),
  componentProps: {},
  path: clientPaths.scheme,
  title: "ColorSchemeSwitch",
  fa: "fas-circle-half-stroke",
  metaTitle: "ColorSchemeSwitch",
};

const MENU_ICONS: MenuItem = {
  name: "FontAwesomeIcon",
  component: () => import("../component/FontAwesomeIcon.vue"),
  componentProps: { icon: "fas-star", spin: true },
  path: clientPaths.icons,
  title: "FontAwesomeIcon",
  fa: "fas-star",
  metaTitle: "FontAwesomeIcon",
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
  fa: "fas-table",
  metaTitle: "StatusBox",
};

export const MENU = Object.freeze([
  MENU_COLORS,
  MENU_SCHEME,
  MENU_ICONS,
  MENU_STATUS,
] as MenuItem[]);
