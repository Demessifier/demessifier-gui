import ColorPalette from "./ColorPalette.vue";
import {
  defaultColors,
  getColorNameComplementFromPlainColorName,
  getColorNameFromPlainColorName,
  getCurrentColor,
  selectByContrastRatio,
  setDefaultColors,
} from "../../provider/color-palette";
import type { StatusBoxFlavorName } from "../../provider/status-box";
import { Color } from "../../model/color";

function testColorOrComplement(
  colorName: string,
  complement: boolean,
  colorValue: Color,
  complementValue: Color,
) {
  const labelPrefix = complement ? "color complement for " : "";
  const labelSuffix = complement ? "" : " color";
  cy.get(`.content .row .color-${colorName}${complement ? "-complement" : ""}`)
    .should((item) => {
      expect(item).to.have.length(1);
      expect(item).to.have.css(
        `${complement ? "background-" : ""}color`,
        colorValue.rgbString,
      );
      expect(item).to.have.css(
        `${complement ? "" : "background-"}color`,
        complementValue.rgbString,
      );
    })
    .find("label")
    .should((lbl) => {
      expect(lbl).to.contain.text(`${labelPrefix}${colorName}${labelSuffix}`);
    })
    .find("input[type=color]")
    .should((input) => {
      expect(input).to.have.value(
        (complement ? complementValue : colorValue).hexStringNoAlpha,
      );
    });
}

function testColorOrComplementSetting(
  colorName: string,
  complement: boolean,
): Color {
  const randomColor = Color.randomColor;
  const fullColorName = complement
    ? getColorNameComplementFromPlainColorName(colorName)
    : getColorNameFromPlainColorName(colorName);
  cy.get(`.${fullColorName} input[type=color]`)
    .should((input) => {
      expect(input).to.have.length(1);
    })
    .each((i) => {
      const input = i.get()[0] as HTMLInputElement;
      input.value = randomColor.hexStringNoAlpha; // doesn't trigger onChange event
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
      const contrast = colorValue.colorsContrastRatio(colorComplement);
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
            getCurrentColor(getColorNameFromPlainColorName(contrastStatus))
              .rgbString,
          );
          expect(contrast).to.have.class(contrastStatus);
        })
        .find("span")
        .should((span) => {
          expect(span).to.have.css(
            "color",
            getCurrentColor(
              getColorNameComplementFromPlainColorName(contrastStatus),
            ).rgbString,
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
            defaultColors[colorName].value.rgbString,
          );
        })
        .find("span")
        .should((span) => {
          expect(span).to.have.css(
            "color",
            defaultColors[colorName].complementValue.rgbString,
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
