import crypto from "crypto";
import { getRandomInteger } from "../provider/randomness";

export abstract class Color {
  readonly alpha100: number;

  get alpha255(): number {
    return (this.alpha100 * 255) / 100;
  }

  get alpha1(): number {
    return this.alpha100 / 100;
  }

  protected constructor(alpha: number | string = 100) {
    this.alpha100 = Color.parseNumber(alpha, 100);
  }

  equals(
    other: Color,
    ignoreAlpha: boolean = false,
    tolerance: number = 0,
  ): boolean {
    const thisRgba = this.rgba;
    const otherRgba = other.rgba;
    if (
      !ignoreAlpha &&
      Math.abs(thisRgba.alpha100 - otherRgba.alpha100) > tolerance
    )
      return false;
    return (
      Math.abs(thisRgba.red255 - otherRgba.red255) <= tolerance &&
      Math.abs(thisRgba.green255 - otherRgba.green255) <= tolerance &&
      Math.abs(thisRgba.blue255 - otherRgba.blue255) <= tolerance
    );
  }

  abstract get rgba(): ColorRGBA;

  abstract get hsla(): ColorHSLA;

  get hexString(): string {
    const thisRgba = this.rgba;
    const rgba255 = [
      thisRgba.red255,
      thisRgba.green255,
      thisRgba.blue255,
      thisRgba.alpha255,
    ];
    const rgbaHex = rgba255.map((c: number): string =>
      Math.round(c).toString(16).padStart(2, "0"),
    );
    return `#${rgbaHex.join("")}`;
  }

  get rgbString(): string {
    const thisRgba = this.rgba;
    const rgb255 = [thisRgba.red255, thisRgba.green255, thisRgba.blue255];
    return `rgb(${rgb255.join(", ")})`;
  }

  toString(): string {
    return this.hexString;
  }

  static parse(input: string): Color {
    input = input.toLowerCase();

    if (/^#[0-9abcdef]{3,4}$/.test(input)) {
      // parse: #RGB
      // parse: #RGBA
      let expanded = "";
      for (const character of input) {
        // duplicate all characters except for the first one which is "#"
        expanded += expanded.length === 0 ? "" : `${character}`;
        expanded += `${character}`;
      }
      return Color.parse(expanded);
    }

    if (/^#[0-9abcdef]{6}([0-9abcdef]{2})?$/.test(input)) {
      // parse: #RRGGBB
      // parse: #RRGGBBAA
      const r = parseInt(input.substring(1, 3), 16);
      const g = parseInt(input.substring(3, 5), 16);
      const b = parseInt(input.substring(5, 7), 16);
      const a =
        input.length === 7
          ? 100
          : (parseInt(input.substring(7, 9), 16) * 100) / 255;
      return new ColorRGBA(r, g, b, a);
    }

    input = input.replaceAll(" ", "");

    function getDigitsRegex(prefix: string, digitsCount: number): RegExp {
      const digit = "\\d+(\\.\\d+)?%?";
      // matches: D
      // matches: D%
      // matches: D.D
      // matches: D.D%

      const minus = ["hsl", "hsla"].some((p) => p === prefix) ? "\\-?" : "";

      let result = "";
      for (let i = 0; i < digitsCount; i++) {
        if (result.length > 0) result += ",";
        result += digit;
      }
      return RegExp(`^${prefix}\\(${minus}${result}\\)$`);
    }

    if (getDigitsRegex("rgb", 3).test(input)) {
      // parse: rgb(R,G,B)
      const items = input
        .replace(/^rgb\(/, "")
        .replace(/\)$/, "")
        .split(",");
      const r = items[0];
      const g = items[1];
      const b = items[2];
      return new ColorRGBA(r, g, b);
    }

    if (getDigitsRegex("rgba", 4).test(input)) {
      // parse: rgba(R,G,B,A)
      const items = input
        .replace(/^rgba\(/, "")
        .replace(/\)$/, "")
        .split(",");
      const r = items[0];
      const g = items[1];
      const b = items[2];
      const a = items[3];
      return new ColorRGBA(r, g, b, a);
    }

    if (getDigitsRegex("hsl", 3).test(input)) {
      // parse: hsl(H,S,L)
      const items = input
        .replace(/^hsl\(/, "")
        .replace(/\)$/, "")
        .split(",");
      const h = items[0];
      const s = items[1];
      const l = items[2];
      return new ColorHSLA(h, s, l);
    }

    if (getDigitsRegex("hsla", 4).test(input)) {
      // parse: hsla(H,S,L,A)
      const items = input
        .replace(/^hsla\(/, "")
        .replace(/\)$/, "")
        .split(",");
      const h = items[0];
      const s = items[1];
      const l = items[2];
      const a = items[3];
      return new ColorHSLA(h, s, l, a);
    }

    throw new Error(`Unexpected format of color: ${input}`);
  }

  static parseNumber(
    value: number | string,
    maximumValue: number,
    allowModulo: boolean = false,
  ): number {
    value = value.toString();
    const isPercentage = value.endsWith("%");
    value = Number(value.replace(/%$/, ""));
    if (isPercentage) value = (value * maximumValue) / 100;

    if (allowModulo) {
      value = value % maximumValue;
      if (value < 0) value += maximumValue;
    }

    if (value < 0) throw new Error(`Color component value ${value} < 0.`);
    if (value > maximumValue)
      throw new Error(`Color component value ${value} > ${maximumValue}.`);

    return value;
  }

  get relativeLuminance(): number {
    const thisRgba = this.rgba;
    const color_1 = [thisRgba.red1, thisRgba.green1, thisRgba.blue1];
    const partialLuminance = color_1.map(
      (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4), // to power 2.4
    );
    const [R, G, B] = partialLuminance;
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
  }

  /**
   * Compute the contrast ratio of 2 colors.
   * @param other The other color.
   * @returns The value of contrast ratio.
   */
  colorsContrastRatio(other: Color): number {
    const luminances = [this.rgba, other.rgba]
      .map((c) => c.relativeLuminance)
      .sort();
    // Contrast ratio = (Y_lighter + 0.05) / (Y_darker + 0.05)
    return (luminances[1] + 0.05) / (luminances[0] + 0.05);
  }

  static get randomColor(): Color {
    return new ColorRGBA(
      getRandomInteger(256),
      getRandomInteger(256),
      getRandomInteger(256),
    );
  }
}

export class ColorRGBA extends Color {
  readonly red255: number;
  readonly green255: number;
  readonly blue255: number;

  get red1(): number {
    return this.red255 / 255;
  }

  get green1(): number {
    return this.green255 / 255;
  }

  get blue1(): number {
    return this.blue255 / 255;
  }

  constructor(
    red: number | string,
    green: number | string,
    blue: number | string,
    alpha: number | string = 100,
  ) {
    super(alpha);

    this.red255 = Color.parseNumber(red, 255);
    this.green255 = Color.parseNumber(green, 255);
    this.blue255 = Color.parseNumber(blue, 255);
  }

  get rgba(): ColorRGBA {
    return this;
  }

  get hsla(): ColorHSLA {
    const red1 = this.red1;
    const green1 = this.green1;
    const blue1 = this.blue1;

    const max1 = Math.max(red1, green1, blue1);
    const min1 = Math.min(red1, green1, blue1);
    const max1MinusMin1 = max1 - min1;
    const max1PlusMin1 = max1 + min1;

    let hue6;
    switch (max1) {
      case min1:
        hue6 = 0;
        break;
      case red1:
        hue6 = (green1 - blue1) / max1MinusMin1;
        break;
      case green1:
        hue6 = 2 + (blue1 - red1) / max1MinusMin1;
        break;
      case blue1:
      default:
        hue6 = 4 + (red1 - green1) / max1MinusMin1;
        break;
    }
    let hue360 = hue6 * 60;
    if (hue360 < 0) hue360 += 360;

    let saturation1;
    if (max1 === min1) saturation1 = 0;
    else if (max1PlusMin1 <= 1) saturation1 = max1MinusMin1 / max1PlusMin1;
    else saturation1 = max1MinusMin1 / (2 - max1PlusMin1);
    const saturation100 = saturation1 * 100;

    const lightness1 = max1PlusMin1 / 2;
    const lightness100 = lightness1 * 100;

    return new ColorHSLA(hue360, saturation100, lightness100, this.alpha100);
  }
}

export class ColorHSLA extends Color {
  readonly hue360: number;
  readonly saturation100: number;
  readonly lightness100: number;

  get saturation1(): number {
    return this.saturation100 / 100;
  }

  get lightness1(): number {
    return this.lightness100 / 100;
  }

  constructor(
    hue: number | string,
    saturation: number | string,
    lightness: number | string,
    alpha: number | string = 100,
  ) {
    super(alpha);

    this.hue360 = Color.parseNumber(hue, 360, true);
    this.saturation100 = Color.parseNumber(saturation, 100);
    this.lightness100 = Color.parseNumber(lightness, 100);
  }

  get hsla(): ColorHSLA {
    return this;
  }

  get rgba(): ColorRGBA {
    const saturation1 = this.saturation1;
    const lightness1 = this.lightness1;
    const hue360 = this.hue360;

    const f = (n: number): number => {
      const a = saturation1 * Math.min(lightness1, 1 - lightness1);
      const k = (n + hue360 / 30) % 12;
      return lightness1 - a * Math.max(-1, Math.min(k - 3, Math.min(9 - k, 1)));
    };

    return new ColorRGBA(255 * f(0), 255 * f(8), 255 * f(4), this.alpha100);
  }
}
