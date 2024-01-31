import ColorPalette from "./ColorPalette.vue";
import {
  computeColorsContrastRatio,
  defaultColors,
  getColorNameComplementFromPlainColorName,
  getColorNameFromPlainColorName,
  getCurrentColor,
  HexColorApproximation,
  hexToRgb,
  selectByContrastRatio,
  setDefaultColors,
} from "../../provider/color-palette";
import { StatusBoxFlavorName } from "../../provider/status-box";

export function getRandomColor(): HexColorApproximation {
  // Returns a random integer from 0 to 255:
  const bytes: string[] = [];
  while (bytes.length < 3) {
    const byte = Math.floor(Math.random() * 256).toString(16);
    bytes.push(byte.length === 2 ? byte : `0${byte}`);
  }
  return `#${bytes.join("")}`;
}

function testColorOrComplement(
  colorName: string,
  complement: boolean,
  colorValue: HexColorApproximation,
  complementValue: HexColorApproximation,
) {
  const labelPrefix = complement ? "color complement for " : "";
  const labelSuffix = complement ? "" : " color";
  cy.get(`.content .row .color-${colorName}${complement ? "-complement" : ""}`)
    .should((item) => {
      expect(item).to.have.length(1);
      expect(item).to.have.css(
        `${complement ? "background-" : ""}color`,
        hexToRgb(colorValue),
      );
      expect(item).to.have.css(
        `${complement ? "" : "background-"}color`,
        hexToRgb(complementValue),
      );
    })
    .find("label")
    .should((lbl) => {
      expect(lbl).to.contain.text(`${labelPrefix}${colorName}${labelSuffix}`);
    })
    .find("input[type=color]")
    .should((input) => {
      expect(input).to.have.value(complement ? complementValue : colorValue);
    });
}

function testColorOrComplementSetting(
  colorName: string,
  complement: boolean,
): HexColorApproximation {
  const randomColor = getRandomColor();
  const fullColorName = complement
    ? getColorNameComplementFromPlainColorName(colorName)
    : getColorNameFromPlainColorName(colorName);
  cy.get(`.${fullColorName} input[type=color]`)
    .should((input) => {
      expect(input).to.have.length(1);
    })
    .each((i) => {
      const input = i.get()[0] as HTMLInputElement;
      input.value = randomColor; // doesn't trigger onChange event
    })
    .trigger("change");
  return randomColor;
}

function testContrasts() {
  cy.get("tbody td.contrast").should((contrast) => {
    expect(contrast).to.have.length(Object.keys(defaultColors).length * 3);
  });
  for (const colorName of Object.keys(defaultColors)) {
    cy.then(() => {
      const colorValue = getCurrentColor(
        getColorNameFromPlainColorName(colorName),
      );
      const colorComplement = getCurrentColor(
        getColorNameComplementFromPlainColorName(colorName),
      );
      const contrast = computeColorsContrastRatio(colorValue, colorComplement);
      const contrastStatus: StatusBoxFlavorName = selectByContrastRatio(
        contrast,
        "success",
        "warn",
        "error",
      );
      const contrastSvgClass: string = selectByContrastRatio(
        contrast,
        "fa-circle-check",
        "fa-circle-exclamation",
        "fa-triangle-exclamation",
      );

      cy.get(`tbody tr.${colorName} td.contrast`)
        .should((contrast) => {
          expect(contrast).to.have.length(3);
          expect(contrast).to.have.css(
            "background-color",
            hexToRgb(
              getCurrentColor(getColorNameFromPlainColorName(contrastStatus)),
            ),
          );
          expect(contrast).to.have.class(contrastStatus);
        })
        .find("span")
        .should((span) => {
          expect(span).to.have.css(
            "color",
            hexToRgb(
              getCurrentColor(
                getColorNameComplementFromPlainColorName(contrastStatus),
              ),
            ),
          );
          expect(span).to.contain.text(contrast.toFixed(2));
        })
        .find("svg")
        .should((svg) => {
          expect(svg).to.have.class(contrastSvgClass);
        });
    });
  }
}

describe("ColorPalette component", () => {
  it("renders", () => {
    // see: https://test-utils.vuejs.org/guide/
    cy.mount(ColorPalette);
    setDefaultColors();
    cy.get(".content .row").should((row) => {
      expect(row).to.have.length(Object.keys(defaultColors).length + 1);
    });
    for (const colorName of Object.keys(defaultColors)) {
      testColorOrComplement(
        colorName,
        false,
        defaultColors[colorName].value,
        defaultColors[colorName].complementValue,
      );
      testColorOrComplement(
        colorName,
        true,
        defaultColors[colorName].value,
        defaultColors[colorName].complementValue,
      );
      cy.get(`tbody td.${colorName}`)
        .should((td) => {
          expect(td).to.have.length.at.least(1);
          expect(td).to.have.css(
            "background-color",
            hexToRgb(defaultColors[colorName].value),
          );
        })
        .find("span")
        .should((span) => {
          expect(span).to.have.css(
            "color",
            hexToRgb(defaultColors[colorName].complementValue),
          );
        });
    }

    testContrasts();

    // test color changing
    for (const colorName of Object.keys(defaultColors)) {
      const randomColor = testColorOrComplementSetting(colorName, false);
      const randomColorComplement = testColorOrComplementSetting(
        colorName,
        true,
      );

      testColorOrComplement(
        colorName,
        false,
        randomColor,
        randomColorComplement,
      );
      testColorOrComplement(
        colorName,
        true,
        randomColor,
        randomColorComplement,
      );
    }

    testContrasts();
  });
});
