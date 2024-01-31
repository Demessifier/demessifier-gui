import {
  getColorNameComplementFromPlainColorName,
  getColorNameFromPlainColorName,
  ValidColorName,
} from "./color-palette";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faCircleCheck,
  faCircleExclamation,
  faCircleInfo,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";

/**
 * FontAwesome icons for the individual box flavors.
 */
const statusBoxIcons = Object.freeze({
  success: faCircleCheck,
  info: faCircleInfo,
  warn: faCircleExclamation,
  error: faTriangleExclamation,
});

/**
 * Box flavor.
 */
export type StatusBoxFlavorName = keyof typeof statusBoxIcons;

/**
 * Get the list of all box flavors.
 * @returns The list of all box flavors.
 */
export function getAllStatusBoxFlavors(): StatusBoxFlavorName[] {
  return Object.keys(statusBoxIcons) as StatusBoxFlavorName[];
}

/**
 * Flavor properties for boxes.
 */
export type StatusBoxFlavorItem = {
  name: StatusBoxFlavorName;
  icon: IconDefinition;
  color: ValidColorName;
  bgColor: ValidColorName;
};

/**
 * Get flavor properties for the given box flavor.
 * @param name Box flavor.
 * @returns Flavor properties for the given box flavor.
 */
export function getFlavorItem(name: StatusBoxFlavorName): StatusBoxFlavorItem {
  return {
    name: name,
    icon: statusBoxIcons[name],
    color: getColorNameComplementFromPlainColorName(name),
    bgColor: getColorNameFromPlainColorName(name),
  };
}

const statusBoxFlavorPreparation: { [key: string]: StatusBoxFlavorItem } = {};
for (const boxFlavor of getAllStatusBoxFlavors()) {
  statusBoxFlavorPreparation[boxFlavor] = getFlavorItem(
    boxFlavor as StatusBoxFlavorName,
  );
}
/**
 * FontAwesome icons for the individual box flavors.
 */
export const statusBoxFlavor = Object.freeze(statusBoxFlavorPreparation);
