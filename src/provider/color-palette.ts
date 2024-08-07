import { ensureMetaTagContent } from "./html-meta-tag";
import { Color } from "../model/color";

type ColorAndComplement = {
  value: Color;
  complementValue: Color;
};

export type ColorPalette = {
  [color: string]: ColorAndComplement;
};

/**
 * The default values of colors.
 */
export const defaultColors: ColorPalette = Object.freeze({
  primary: {
    value: Color.parse("#7c2e9c"),
    complementValue: Color.parse("#ffffff"),
  },
  secondary: {
    value: Color.parse("#edbefe"),
    complementValue: Color.parse("#000000"),
  },
  success: {
    value: Color.parse("#b3ff80"),
    complementValue: Color.parse("#000000"),
  },
  info: {
    value: Color.parse("#90aafe"),
    complementValue: Color.parse("#000000"),
  },
  warn: {
    value: Color.parse("#fec17c"),
    complementValue: Color.parse("#000000"),
  },
  error: {
    value: Color.parse("#ff7a85"),
    complementValue: Color.parse("#000000"),
  },
});

type PlainColorName = keyof typeof defaultColors;
/**
 * Color valid variable names.
 */
export type ValidColorName =
  | `color-${PlainColorName}`
  | `color-${PlainColorName}-complement`;

let root: HTMLElement | null = null;

function ensureRootObjects(): HTMLElement {
  if (root === null) {
    root = document.querySelector(":root") as HTMLElement;
  }
  return root;
}

function getRootStyleProperty(propertyName: string): string {
  return getComputedStyle(ensureRootObjects()).getPropertyValue(propertyName);
}

function setRootStyleProperty(propertyName: string, propertyValue: string) {
  return ensureRootObjects().style.setProperty(propertyName, propertyValue);
}

/**
 * Sets the CSS color variable.
 * @param colorName CSS variable name associated with the color.
 * @param colorValue CSS color value to be set.
 */
export function setColor(
  colorName: ValidColorName | "default-bg-color",
  colorValue: Color,
) {
  const hexString = colorValue.hexStringWithAlpha;
  setRootStyleProperty(`--${colorName}`, hexString);
  if (colorName === "color-primary")
    ensureMetaTagContent("theme-color", hexString);
}

/**
 * Retrieves the currently set CSS color variable value based the color name.
 * @param colorName Name of the color to be retrieved.
 * @returns Color value.
 */
export function getCurrentColor(
  colorName: ValidColorName | "default-bg-color",
): Color {
  const defaultColor = Color.parse("#808080");
  const retrievedValue = getRootStyleProperty(`--${colorName}`); // empty string if not set

  return retrievedValue.trim() === ""
    ? defaultColor
    : Color.parse(retrievedValue);
}

/**
 * Compose color variable name.
 * @param plainColorName The basic name of the color.
 * @returns Variable name in the "color-${name}" format.
 */
export function getColorNameFromPlainColorName(
  plainColorName: keyof typeof defaultColors,
): ValidColorName {
  return `color-${plainColorName}`;
}

/**
 * Compose color complement variable name.
 * @param plainColorName The basic name of the color.
 * @returns Variable name in the "color-${name}-complement" format.
 */
export function getColorNameComplementFromPlainColorName(
  plainColorName: keyof typeof defaultColors,
): ValidColorName {
  return `color-${plainColorName}-complement`;
}

/**
 * Set the default CSS color variables.
 */
export function setColors(colorPalette: ColorPalette) {
  for (const [key, value] of Object.entries(colorPalette)) {
    setColor(`color-${key}`, value.value);
    setColor(`color-${key}-complement`, value.complementValue);
  }
}

/**
 * Set the default CSS color variables.
 */
export function setDefaultColors() {
  setColors(defaultColors);
}

/**
 * Select a value depending on contrast ratio.
 * @param contrastRatio It is decided based on this contrast ration. Valid values are 1-21
 * @param ok This value is returned for contrast ratio 7-21
 * @param meh This value is returned for contrast ratio 4.5-7
 * @param bad This value is returned for contrast ratio 7-21
 * @returns One of the provided values depending on the contrast ratio.
 */
export function selectByContrastRatio<T>(
  contrastRatio: number,
  ok: T,
  meh: T,
  bad: T,
): T {
  if (contrastRatio < 1 || 21 < contrastRatio)
    throw new Error(`Invalid contrast ration value: ${contrastRatio}`);
  if (contrastRatio > 7) {
    return ok;
  }
  if (contrastRatio < 4.5) {
    return bad;
  }
  return meh;
}
