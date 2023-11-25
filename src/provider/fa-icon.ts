import { library } from "@fortawesome/fontawesome-svg-core";
import * as faBrands from "@fortawesome/free-brands-svg-icons";
import * as faRegular from "@fortawesome/free-regular-svg-icons";
import * as faSolid from "@fortawesome/free-solid-svg-icons";

/**
 * FontAwesome icon definition object.
 */
export type IconDefinition =
  | faBrands.IconDefinition
  | faRegular.IconDefinition
  | faSolid.IconDefinition;

const BRANDS_ICON_PACK = Object.freeze({
  // "fab-google": faBrands.faGoogle,
}); // add requested brands FA icons here

const REGULAR_ICON_PACK = Object.freeze({
  // "far-bars": faRegular.faCircleUser,
}); // add requested regular FA icons here

const SOLID_ICON_PACK = Object.freeze({
  "fas-bars": faSolid.faBars,
  "fas-circle-xmark": faSolid.faCircleXmark,
  "fas-chevron-down": faSolid.faChevronDown,
  "fas-circle-half-stroke": faSolid.faCircleHalfStroke,
  "fas-circle-check": faSolid.faCircleCheck,
  "fas-circle-info": faSolid.faCircleInfo,
  "fas-circle-exclamation": faSolid.faCircleExclamation,
  "fas-triangle-exclamation": faSolid.faTriangleExclamation,
}); // add requested solid FA icons here

type FabIconPack = typeof BRANDS_ICON_PACK;
type FarIconPack = typeof REGULAR_ICON_PACK;
type FasIconPack = typeof SOLID_ICON_PACK;

type FabIcon = keyof FabIconPack;
type FarIcon = keyof FarIconPack;
type FasIcon = keyof FasIconPack;
/**
 * Enum of FontAwesome icons added to the library.
 */
export type FaIcon = FabIcon | FarIcon | FasIcon;

const ICON_PACK = Object.freeze({
  ...BRANDS_ICON_PACK,
  ...REGULAR_ICON_PACK,
  ...SOLID_ICON_PACK,
});
type IconPack = typeof ICON_PACK;

/**
 * Gets the definition object of the selected FontAwesome icon.
 * @param icon Name of the FontAwesome icon.
 * @returns Definition object of the selected FontAwesome icon.
 */
export function getIconObject(icon: FaIcon): IconDefinition {
  return ICON_PACK[icon];
}

type ClassName = `fa-${string}`;

/**
 * Translates the icon name to the "fa-NAME" svg class name.
 * This is for testing purposes only.
 * @param icon FontAwesome icon name.
 * @returns FontAwesome svg class name in the "fa-NAME" format.
 */
export function getIconClassName(icon: FaIcon): ClassName {
  const indexOfCharToBeRemoved = 2;
  return (icon.substring(0, indexOfCharToBeRemoved) +
    icon.substring(indexOfCharToBeRemoved + 1, icon.length)) as ClassName;
}

/**
 * Initializes the FontAwesome library.
 * Call this from your main app file.
 * @returns The list of loaded FontAwesome icons.
 */
export function faIconInit(): IconPack {
  library.add(ICON_PACK);
  return ICON_PACK;
}
