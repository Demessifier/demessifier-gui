import ColorPaletteTdContrast from "./ColorPaletteTdContrast.vue";
import { getRandomColor } from "./ColorPalette.cy";
import {
  computeColorsContrastRatio,
  HexColorApproximation,
  selectByContrastRatio,
} from "../../provider/color-palette";

function runTestsForColorPair(props: {
  colorValue: HexColorApproximation;
  otherColorValue: HexColorApproximation;
}) {
  it(`Renders ${JSON.stringify(props)}`, () => {
    const contrastValue = computeColorsContrastRatio(
      props.colorValue,
      props.otherColorValue
    );
    const contrastClass = selectByContrastRatio(
      contrastValue,
      "success",
      "warn",
      "error"
    );
    cy.mount(ColorPaletteTdContrast, { props: props });
    cy.get("td.contrast").should((td) => {
      expect(td).to.have.class(contrastClass);
    });
    cy.get("td.contrast span").should((span) => {
      expect(span).to.contain.text(contrastValue.toFixed(2));
    });
  });
}

describe("ColorPaletteTdContrast component", () => {
  runTestsForColorPair({ colorValue: "#000000", otherColorValue: "#000000" });
  runTestsForColorPair({ colorValue: "#000000", otherColorValue: "#FFFFFF" });
  runTestsForColorPair({ colorValue: "#FFFFFF", otherColorValue: "#000000" });
  runTestsForColorPair({ colorValue: "#FFFFFF", otherColorValue: "#FFFFFF" });
  for (let _ = 0; _ < 30; _++) {
    const props = {
      colorValue: getRandomColor(),
      otherColorValue: getRandomColor(),
    };
    runTestsForColorPair(props);
  }
});
