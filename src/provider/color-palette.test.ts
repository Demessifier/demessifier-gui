import { test, expect } from "vitest";
import {
  defaultColors,
  setColor,
  getCurrentColor,
  getColorNameFromPlainColorName,
  getColorNameComplementFromPlainColorName,
  setDefaultColors,
  HexColorApproximation,
  checkColorValueHex,
  ValidColorName,
  computeColorsContrastRatio,
  AnyColorType,
  hexToRgb,
} from "./color-palette";
import crypto from "crypto";

function checkMetaThemeColor(
  colorName: ValidColorName,
  colorValue: HexColorApproximation
) {
  if (colorName !== "color-primary") return;

  const metasCollection = document.head.getElementsByTagName(
    "meta"
  ) as HTMLCollectionOf<HTMLMetaElement>;
  const metasArray = [...metasCollection];
  const metas = metasArray.filter((meta) => meta.name === "theme-color");
  expect(metas.length).to.be.equal(1);
  const currentColorValue = metas[0].content as HexColorApproximation;
  expect(currentColorValue).to.be.equal(colorValue);
}

function setAndCheckDefaultColors() {
  setDefaultColors();
  for (const [colorName, color] of Object.entries(defaultColors)) {
    const colorNameColor = getColorNameFromPlainColorName(colorName);
    expect(getCurrentColor(colorNameColor)).to.be.equal(color.value);
    const colorNameComplement =
      getColorNameComplementFromPlainColorName(colorName);
    expect(getCurrentColor(colorNameComplement)).to.be.equal(
      color.complementValue
    );
    checkMetaThemeColor(colorNameColor, color.value);
  }
}

function getRandomColor(): HexColorApproximation {
  return `#${crypto.randomBytes(3).toString("hex")}`;
}

test("color palette", async () => {
  expect(defaultColors).to.be.ok;
  const colorNames = Object.keys(defaultColors);
  expect(colorNames.length).to.be.equal(6);

  for (const colorName of colorNames) {
    expect(getColorNameFromPlainColorName(colorName)).to.be.equal(
      `color-${colorName}`
    );
    expect(getColorNameComplementFromPlainColorName(colorName)).to.be.equal(
      `color-${colorName}-complement`
    );
  }

  setAndCheckDefaultColors();

  // set and check random colors
  const randomColors: HexColorApproximation[] = [];
  const randomComplements: HexColorApproximation[] = [];
  for (const colorName of colorNames) {
    const randomColor = getRandomColor();
    const randomComplement = getRandomColor();
    randomColors.push(randomColor);
    randomComplements.push(randomComplement);
    const colorNameColor = getColorNameFromPlainColorName(colorName);
    const colorNameComplement =
      getColorNameComplementFromPlainColorName(colorName);
    setColor(colorNameColor, randomColor);
    expect(getCurrentColor(colorNameColor)).to.be.equal(randomColor);
    checkMetaThemeColor(colorNameColor, randomColor);
    setColor(colorNameComplement, randomComplement);
    expect(getCurrentColor(colorNameComplement)).to.be.equal(randomComplement);
    const randomBytes = crypto.randomBytes(2).toString("hex");
    const badColor: HexColorApproximation = `${randomColor}${randomBytes}`;
    const badComplement: HexColorApproximation = `${randomColor}${randomBytes}`;
    expect(() => checkColorValueHex(badColor)).to.throw(
      `Unexpected length of color '${badColor}'.`
    );
    expect(() => checkColorValueHex(badComplement)).to.throw(
      `Unexpected length of color '${badComplement}'.`
    );
    const randomByte = crypto.randomBytes(1).toString("hex");
    expect(() => checkColorValueHex(`#${randomByte}x`)).to.throw(
      `Unexpected color value '#${randomByte}x'.`
    );
  }
  for (let c = 0; c < colorNames.length; c++) {
    const colorName = colorNames[c];
    const color = randomColors[c];
    const complement = randomComplements[c];
    const colorNameColor = getColorNameFromPlainColorName(colorName);
    const colorNameComplement =
      getColorNameComplementFromPlainColorName(colorName);
    expect(getCurrentColor(colorNameColor)).to.be.equal(color);
    checkMetaThemeColor(colorNameColor, color);
    expect(getCurrentColor(colorNameComplement)).to.be.equal(complement);
  }

  setAndCheckDefaultColors();

  const root = document.querySelector(":root") as HTMLElement;
  const rootStyle = root.style;
  const defaultColor = "#888888";
  for (const colorName of colorNames) {
    const colorNameColor = getColorNameFromPlainColorName(colorName);
    const colorNameComplement =
      getColorNameComplementFromPlainColorName(colorName);
    for (const color of [colorNameColor, colorNameComplement]) {
      expect(getCurrentColor(color)).not.to.be.equal(defaultColor);
      rootStyle.removeProperty(`--${color}`);
      expect(getCurrentColor(color)).to.be.equal(defaultColor);
    }
  }

  setAndCheckDefaultColors();
});

test("contrast ratio", async () => {
  for (const [colorName, color] of Object.entries(defaultColors)) {
    const colorToComplementContrastRatio = computeColorsContrastRatio(
      color.value,
      color.complementValue
    );
    expect(
      colorToComplementContrastRatio,
      `symmetry - ${colorName}`
    ).to.be.equal(
      computeColorsContrastRatio(color.complementValue, color.value)
    );
    expect(
      computeColorsContrastRatio(color.value, color.value),
      `same color - ${colorName}`
    ).to.be.equal(1);
    expect(
      computeColorsContrastRatio(color.complementValue, color.complementValue),
      `same complement - ${colorName}`
    ).to.be.equal(1);
    expect(
      colorToComplementContrastRatio,
      `defaults are contrasting enough - ${colorName}`
    ).to.be.at.least(7); // technical minimum is 1, but we have contrasting colors
    expect(
      colorToComplementContrastRatio,
      `less than maximum - ${colorName}`
    ).to.be.at.most(21);
  }
  const exampleContrastRation = computeColorsContrastRatio("#123", "#987");
  expect(exampleContrastRation, "RGB ~ RRGGBB").to.be.equal(
    computeColorsContrastRatio("#112233", "#998877")
  );
  expect(exampleContrastRation, "RGB ~ RGBA").to.be.equal(
    computeColorsContrastRatio("#1234", "#9876")
  );
  expect(exampleContrastRation, "RGB ~ RRGGBBAA").to.be.equal(
    computeColorsContrastRatio("#11223344", "#99887766")
  );
  expect(exampleContrastRation, "RGB ~ RGB(A)").to.be.equal(
    computeColorsContrastRatio("#123f", "#987f")
  );
  expect(exampleContrastRation, "RGB ~ RRGGBB(AA)").to.be.equal(
    computeColorsContrastRatio("#112233ff", "#998877ff")
  );
  expect(exampleContrastRation, "RGB ~ [RR GG BB]").to.be.equal(
    computeColorsContrastRatio([0x11, 0x22, 0x33], [0x99, 0x88, 0x77])
  );

  expect(
    computeColorsContrastRatio("#000", "#fff"),
    "black and white"
  ).to.be.equal(21);

  expect(() =>
    computeColorsContrastRatio(
      [999, 88, 4] as AnyColorType,
      "#bad" as AnyColorType
    )
  ).to.throw("Invalid byte '999' in color RGB/RGBA [999,88,4].");
  expect(() => computeColorsContrastRatio("#badbadbad", "#bad")).to.throw(
    "Unexpected length of color '#badbadbad'."
  );
  expect(() => computeColorsContrastRatio("#bad", "#xyz")).to.throw(
    "Unexpected color value '#xyz'."
  );
  expect(() => computeColorsContrastRatio({} as AnyColorType, "#xyz")).to.throw(
    `Unexpected type of color '${{}}'.`
  );
});

test("hexToRgb", async () => {
  expect(hexToRgb).to.be.ok;
  for (const invalidColor of [
    "#",
    "#0",
    "#00",
    "#000",
    "#0000",
    "#00000",
    "#XXYYZZ",
    "#0000000",
    "#00000000",
  ]) {
    expect(() => hexToRgb(invalidColor)).to.throw(
      `Unable to parse color '${invalidColor}' as HEX #RRGGBB.`
    );
  }
  expect(hexToRgb("#000000")).to.be.equal("rgb(0, 0, 0)");
  expect(hexToRgb("#FFFFFF")).to.be.equal("rgb(255, 255, 255)");
  expect(hexToRgb("#DEADFF")).to.be.equal("rgb(222, 173, 255)");
  expect(hexToRgb("#00BEEF")).to.be.equal("rgb(0, 190, 239)");
});
