import ColorPaletteTdContrast from "./ColorPaletteTdContrast.vue";
import { selectByContrastRatio } from "../../provider/color-palette";
import { Color, ColorRGBA } from "../../model/color";
import { getPairs } from "../../provider/combinations";

function runTestsForColorPair(props: {
  colorValue: Color;
  otherColorValue: Color;
}) {
  it(`Renders ${JSON.stringify(props)}`, () => {
    const contrastValue = props.colorValue.colorsContrastRatio(
      props.otherColorValue,
    );
    const contrastClass = selectByContrastRatio(
      contrastValue,
      "success",
      "warn",
      "error",
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
  for (const pair of getPairs([
    new ColorRGBA(0, 0, 0),
    new ColorRGBA(255, 255, 255),
  ])) {
    runTestsForColorPair({ colorValue: pair[0], otherColorValue: pair[1] });
  }
  for (let _ = 0; _ < 30; _++) {
    const props = {
      colorValue: Color.randomColor,
      otherColorValue: Color.randomColor,
    };
    runTestsForColorPair(props);
  }
});
