import { test, expect } from "vitest";
import {
  defaultColors,
  setColor,
  getCurrentColor,
  getColorNameFromPlainColorName,
  getColorNameComplementFromPlainColorName,
  setDefaultColors,
  ValidColorName,
  selectByContrastRatio,
} from "./color-palette";
import crypto from "crypto";
import { Color } from "../model/color";

function checkMetaThemeColor(colorName: ValidColorName, colorValue: Color) {
  if (colorName !== "color-primary") return;

  const metasCollection = document.head.getElementsByTagName(
    "meta",
  ) as HTMLCollectionOf<HTMLMetaElement>;
  const metasArray = [...metasCollection];
  const metas = metasArray.filter((meta) => meta.name === "theme-color");
  expect(metas.length).to.be.equal(1);
  const currentColorValue = Color.parse(metas[0].content);
  expect(currentColorValue.equals(colorValue)).to.be.true;
}

function setAndCheckDefaultColors() {
  setDefaultColors();
  for (const [colorName, color] of Object.entries(defaultColors)) {
    const colorNameColor = getColorNameFromPlainColorName(colorName);
    expect(getCurrentColor(colorNameColor).equals(color.value)).to.be.true;
    const colorNameComplement =
      getColorNameComplementFromPlainColorName(colorName);
    expect(getCurrentColor(colorNameComplement).equals(color.complementValue))
      .to.be.true;
    checkMetaThemeColor(colorNameColor, color.value);
  }
}

test("color palette", async () => {
  expect(defaultColors).to.be.ok;
  const colorNames = Object.keys(defaultColors);
  expect(colorNames.length).to.be.equal(6);

  for (const colorName of colorNames) {
    expect(getColorNameFromPlainColorName(colorName)).to.be.equal(
      `color-${colorName}`,
    );
    expect(getColorNameComplementFromPlainColorName(colorName)).to.be.equal(
      `color-${colorName}-complement`,
    );
  }

  setAndCheckDefaultColors();

  // set and check random colors
  const randomColors: Color[] = [];
  const randomComplements: Color[] = [];
  for (const colorName of colorNames) {
    const randomColor = Color.randomColor;
    const randomComplement = Color.randomColor;
    randomColors.push(randomColor);
    randomComplements.push(randomComplement);
    const colorNameColor = getColorNameFromPlainColorName(colorName);
    const colorNameComplement =
      getColorNameComplementFromPlainColorName(colorName);
    setColor(colorNameColor, randomColor);
    expect(getCurrentColor(colorNameColor).equals(randomColor)).to.be.true;
    checkMetaThemeColor(colorNameColor, randomColor);
    setColor(colorNameComplement, randomComplement);
    expect(getCurrentColor(colorNameComplement).equals(randomComplement)).to.be
      .true;
    const randomBytes = crypto.randomBytes(2).toString("hex");
    expect(() =>
      Color.parse(`${randomColor.hexString}${randomBytes}`),
    ).to.throw(
      `Unexpected format of color: ${randomColor.hexString}${randomBytes}`,
    );
    expect(() =>
      Color.parse(`${randomColor.hexString}${randomBytes}`),
    ).to.throw(
      `Unexpected format of color: ${randomColor.hexString}${randomBytes}`,
    );
    const randomByte = crypto.randomBytes(1).toString("hex");
    expect(() => Color.parse(`#${randomByte}x`)).to.throw(
      `Unexpected format of color: #${randomByte}x`,
    );
  }
  for (let c = 0; c < colorNames.length; c++) {
    const colorName = colorNames[c];
    const color = randomColors[c];
    const complement = randomComplements[c];
    const colorNameColor = getColorNameFromPlainColorName(colorName);
    const colorNameComplement =
      getColorNameComplementFromPlainColorName(colorName);
    expect(getCurrentColor(colorNameColor).equals(color)).to.be.true;
    checkMetaThemeColor(colorNameColor, color);
    expect(getCurrentColor(colorNameComplement).equals(complement)).to.be.true;
  }

  setAndCheckDefaultColors();

  const root = document.querySelector(":root") as HTMLElement;
  const rootStyle = root.style;
  const defaultColor = Color.parse("#888888");
  for (const colorName of colorNames) {
    const colorNameColor = getColorNameFromPlainColorName(colorName);
    const colorNameComplement =
      getColorNameComplementFromPlainColorName(colorName);
    for (const color of [colorNameColor, colorNameComplement]) {
      expect(getCurrentColor(color).equals(defaultColor)).to.be.false;
      rootStyle.removeProperty(`--${color}`);
      expect(getCurrentColor(color).equals(defaultColor)).to.be.true;
    }
  }

  setAndCheckDefaultColors();
});

test("selectByContrastRatio", async () => {
  for (const values of [
    ["good", "not good", "horrible"],
    [true, undefined, false],
    [42, 0, -42],
  ]) {
    for (const contrast of [
      -999, -100, -52.52, -8, -2, -1, 0, 0.5, 0.999, 21.001, 21.5, 22, 52.52,
      100, 999,
    ]) {
      expect(() =>
        selectByContrastRatio(contrast, values[0], values[1], values[2]),
      ).to.throw(`Invalid contrast ration value: ${contrast}`);
    }
    const contrasts = [
      [7.001, 8, 10, 16.789, 20, 20.99, 21],
      [4.5, 4.501, 5, 6.9, 6.999, 7],
      [1, 1.1, 2, 3.75, 4, 4.499],
    ];
    for (let i = 0; i < 3; i++) {
      for (const contrast of contrasts[i]) {
        expect(
          selectByContrastRatio(contrast, values[0], values[1], values[2]),
        ).to.be.equal(values[i]);
      }
    }
  }
});
