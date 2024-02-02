import {
  faCircleDot,
  faCircleHalfStroke,
  faPalette,
  faTable,
} from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import ColorSchemeSwitch from "../component/global-controller/ColorSchemeSwitch.vue";
import StatusBox from "../component/StatusBox.vue";
import ColorPalette from "../component/global-controller/ColorPalette.vue";
import ButtonWithIcon from "../component/global-controller/ButtonWithIcon.vue";

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
  component: () => any; // TODO: remove any
  componentProps: any; // TODO: remove any
  path: ClientPath;
  title: string;
  fa: IconDefinition;
  metaTitle: string;
};

const MENU_COLORS: MenuItem = {
  name: "ColorPalette",
  component: () => ColorPalette,
  componentProps: {},
  path: clientPaths._,
  title: "ColorPalette",
  fa: faPalette,
  metaTitle: "ColorPalette",
};

const MENU_SCHEME: MenuItem = {
  name: "ColorSchemeSwitch",
  component: () => ColorSchemeSwitch,
  componentProps: {},
  path: clientPaths.scheme,
  title: "ColorSchemeSwitch",
  fa: faCircleHalfStroke,
  metaTitle: "ColorSchemeSwitch",
};

const MENU_STATUS: MenuItem = {
  name: "StatusBox",
  component: () => StatusBox,
  componentProps: {
    headlineText: "StatusBox",
    boxFlavorName: "success",
  },
  path: clientPaths.status,
  title: "StatusBox",
  fa: faTable,
  metaTitle: "StatusBox",
};

const MENU_ICON_BUTTON: MenuItem = {
  name: "ButtonWithIcon",
  component: () => ButtonWithIcon,
  componentProps: {
    text: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Mauris tincidunt sem sed arcu. Sed ac dolor sit amet purus malesuada congue. Etiam neque. Nullam faucibus mi quis velit. Integer rutrum, orci vestibulum ullamcorper ultricies, lacus quam ultricies odio, vitae placerat pede sem sit amet enim. Aenean placerat. Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur? Fusce dui leo, imperdiet in, aliquam sit amet, feugiat eu, orci.",
    icon: faCircleDot,
  },
  path: clientPaths.iconButton,
  title: "ButtonWithIcon",
  fa: faCircleDot,
  metaTitle: "ButtonWithIcon",
};

export const MENU = Object.freeze([
  MENU_COLORS,
  MENU_SCHEME,
  MENU_STATUS,
  MENU_ICON_BUTTON,
] as MenuItem[]);
