import { library } from "@fortawesome/fontawesome-svg-core";
import * as faBrands from "@fortawesome/free-brands-svg-icons";
import * as faRegular from "@fortawesome/free-regular-svg-icons";
import * as faSolid from "@fortawesome/free-solid-svg-icons";

export type BrandsIconPackKey = `fab-${string}`;
export type RegularIconPackKey = `far-${string}`;
export type SolidIconPackKey = `fas-${string}`;
// export type IconPackKey =
//   | BrandsIconPackKey
//   | RegularIconPackKey
//   | SolidIconPackKey;

export type IconDefinition =
  | faBrands.IconDefinition
  | faRegular.IconDefinition
  | faSolid.IconDefinition;

export type BrandsIconPack = {
  [key: BrandsIconPackKey]: faBrands.IconDefinition;
};
export type RegularIconPack = {
  [key: RegularIconPackKey]: faRegular.IconDefinition;
};
export type SolidIconPack = {
  [key: SolidIconPackKey]: faSolid.IconDefinition;
};

const BRANDS_ICON_PACK: BrandsIconPack = Object.freeze({
  // "fab-google": faBrands.faGoogle,
}); // add requested brands FA icons here

const REGULAR_ICON_PACK: RegularIconPack = Object.freeze({
  // "far-bars": faRegular.faCircleUser,
}); // add requested regular FA icons here

const SOLID_ICON_PACK: SolidIconPack = Object.freeze({
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
export type FaIcon = FabIcon | FarIcon | FasIcon;

type IconPack = { [key: FaIcon]: IconDefinition };
const ICON_PACK: IconPack = Object.freeze({
  ...BRANDS_ICON_PACK,
  ...REGULAR_ICON_PACK,
  ...SOLID_ICON_PACK,
});

export function getIconObject(icon: FaIcon): IconDefinition {
  return ICON_PACK[icon];
}

export function faIconInit(): IconPack {
  library.add(ICON_PACK);
  return ICON_PACK;
}
