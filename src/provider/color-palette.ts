import { ensureMetaTagContent } from "./html-meta-tag";

// TODO: proper color type - upvote here: https://github.com/Microsoft/TypeScript/issues/6579
// type HexDigit =
//   '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' |
//   'a' | 'A' | 'b' | 'B' | 'c' | 'C' | 'd' | 'D' | 'e' | 'E' | 'f' | 'F';
// type HexByte = `${HexDigit}${HexDigit}`;
// type HexColor = `#${HexByte}${HexByte}${HexByte}`;
/**
 * An approximation of the "#RGB" color value format.
 */
export type HexColorApproximation = `#${string}`;
const hexColorLengths = [3, 4, 6, 8] as const;
const hexColorLengthsAsNumbers = Object.freeze(
  hexColorLengths.map((n) => n as number),
);
type HexColorLength = (typeof hexColorLengths)[number];

type ColorRgb = [number, number, number];
type ColorRgba = [number, number, number, number];
type ColorRgb_a = ColorRgb | ColorRgba;

/**
 * Either "#RGB" or [R,G,B]. Supports also alpha.
 */
export type AnyColorType = HexColorApproximation | ColorRgb_a;

type ColorAndComplement = {
  value: HexColorApproximation;
  complementValue: HexColorApproximation;
};

type ColorPalette = {
  [color: string]: ColorAndComplement;
};

/**
 * The default values of colors.
 */
export const defaultColors: ColorPalette = Object.freeze({
  primary: {
    value: "#7c2e9c",
    complementValue: "#ffffff",
  },
  secondary: {
    value: "#edbefe",
    complementValue: "#000000",
  },
  success: {
    value: "#b3ff80",
    complementValue: "#000000",
  },
  info: {
    value: "#90aafe",
    complementValue: "#000000",
  },
  warn: {
    value: "#fec17c",
    complementValue: "#000000",
  },
  error: {
    value: "#ff7a85",
    complementValue: "#000000",
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

// TODO: try rewire instead of export: https://www.samanthaming.com/journal/2-testing-non-exported-functions/
/**
 * Checks a value of CSS color. Throws Errors when it is invalid.
 * @param colorValue CSS color value in one of the "#RGB", "#RGBA", "#RRGGBB", "#RRGGBBAA formats.
 * @returns Length of the color value excluding the "#" sign.
 */
export function checkColorValueHex(
  colorValue: HexColorApproximation,
): HexColorLength {
  const length = colorValue.length - 1;
  if (!hexColorLengthsAsNumbers.includes(length))
    throw new Error(`Unexpected length of color '${colorValue}'.`);
  const regex = /^#[a-fA-F0-9]+$/;
  if (!regex.test(colorValue))
    throw new Error(`Unexpected color value '${colorValue}'.`);
  return length as HexColorLength;
}

/**
 * Sets the CSS color variable.
 * @param colorName CSS variable name associated with the color.
 * @param colorValue CSS color value to be set.
 */
export function setColor(
  colorName: ValidColorName,
  colorValue: HexColorApproximation,
) {
  checkColorValueHex(colorValue);

  setRootStyleProperty(`--${colorName}`, colorValue);
  if (colorName === "color-primary")
    ensureMetaTagContent("theme-color", colorValue);
}

/**
 * Retrieves the currently set CSS color variable value based the color name.
 * @param colorName Name of the color to be retrieved.
 * @returns Color value in the "#RRGGBB" hex format.
 */
export function getCurrentColor(
  colorName: ValidColorName,
): HexColorApproximation {
  const defaultColor = "#888888" as HexColorApproximation;
  const retrievedValue = getRootStyleProperty(`--${colorName}`); // empty string if not set

  return retrievedValue.trim() == ""
    ? defaultColor
    : (retrievedValue as HexColorApproximation);
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

function checkRgbBytes(color: ColorRgb_a) {
  for (const byte of color) {
    if (byte < 0 || byte >= 256 || byte % 1 !== 0)
      throw new Error(
        `Invalid byte '${byte}' in color RGB/RGBA [${color.join(",")}].`,
      );
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

function computeRelativeLuminance(color_256: ColorRgb_a): number {
  if (color_256.length === 4) color_256.pop();
  const color_1 = color_256.map((c) => c / 255);
  const partialLuminance = color_1.map(
    (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4), // to power 2.4
  );
  const [R, G, B] = partialLuminance;
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function colorHexToBytes(color: HexColorApproximation): ColorRgb_a {
  checkColorValueHex(color);
  const colorWithoutHash = color.substring(1);
  let bytes: string[] = [];
  switch (colorWithoutHash.length) {
    case 3:
    case 4:
      // split to characters and double each
      // RGB  -> RR GG BB
      // RGBA -> RR GG BB AA
      bytes = colorWithoutHash.split("").map((c) => `${c}${c}`);
      break;
    case 6:
    case 8:
      // split to pairs
      // RRGGBB   -> RR GG BB
      // RRGGBBAA -> RR GG BB AA
      bytes = colorWithoutHash.match(/(..?)/g) as string[];
      break;
    // default: // unreachable - covered by checkColorValue(color)
    //   throw new Error(`Unexpected length of color '${color}'.`);
  }
  return bytes.map((c) => parseInt(c, 16)) as ColorRgb_a;
}

/**
 * Compute the contrast ratio of 2 colors.
 * @param color1 Color value.
 * @param color2 Color value.
 * @returns The value of contrast ratio.
 */
export function computeColorsContrastRatio(
  color1: AnyColorType,
  color2: AnyColorType,
): number {
  const colors: ColorRgb_a[] = [color1, color2].map((c) => {
    switch (typeof c) {
      case "string":
        return colorHexToBytes(c);
      case "object":
        Array.isArray(c);
        if (Array.isArray(c) && c.every((item) => Number.isFinite(item)))
          return c;
      // if (c instanceof String)
      //   return colorHexToBytes(c);
    }
    throw new Error(`Unexpected type of color '${c}'.`);
  });
  for (const color of colors) {
    checkRgbBytes(color);
  }
  const luminances = colors.map((c) => computeRelativeLuminance(c)).sort();
  // Contrast ratio = (Y_lighter + 0.05) / (Y_darker + 0.05)
  return (luminances[1] + 0.05) / (luminances[0] + 0.05);
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
