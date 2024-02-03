import { ensureMetaTagContent } from "./html-meta-tag";
import { Color } from "../model/color";

type ColorAndComplement = {
  value: Color;
  complementValue: Color;
};

type ColorPalette = {
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
export function setColor(colorName: ValidColorName, colorValue: Color) {
  const hexString = colorValue.hexString;
  setRootStyleProperty(`--${colorName}`, hexString);
  if (colorName === "color-primary")
    ensureMetaTagContent("theme-color", hexString);
}

/**
 * Retrieves the currently set CSS color variable value based the color name.
 * @param colorName Name of the color to be retrieved.
 * @returns Color value in the "#RRGGBB" hex format.
 */
export function getCurrentColor(colorName: ValidColorName): Color {
  const defaultColor = Color.parse("#888888");
  const retrievedValue = getRootStyleProperty(`--${colorName}`); // empty string if not set

  return retrievedValue.trim() == ""
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
export function setDefaultColors() {
  for (const [key, value] of Object.entries(defaultColors)) {
    setColor(`color-${key}`, value.value);
    setColor(`color-${key}-complement`, value.complementValue);
  }
}

/**
 * Convert color format.
 * @param hex Color in the "#RRGGBB" hex format.
 * @returns Color in the "rgb(R, G, B)" decimal format.
 */
export function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  const errMessage = `Unable to parse color '${hex}' as HEX #RRGGBB.`;
  if (result === null) throw new Error(errMessage);
  const parsed: RegExpExecArray = result;

  function rgbAsNum(i: number): number {
    return parseInt(parsed[i], 16);
  }

  return `rgb(${rgbAsNum(1)}, ${rgbAsNum(2)}, ${rgbAsNum(3)})`;
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
  return contrastRatio > 7 ? ok : contrastRatio < 4.5 ? bad : meh;
}
