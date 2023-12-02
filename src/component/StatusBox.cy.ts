import StatusBox from "./StatusBox.vue";
import {
  getAllStatusBoxFlavors,
  getFlavorItem,
  StatusBoxFlavorName,
} from "../provider/status-box";
import { getIconClassName } from "../provider/fa-icon";
import {
  getColorNameComplementFromPlainColorName,
  getColorNameFromPlainColorName,
  getCurrentColor,
  hexToRgb,
} from "../provider/color-palette";

function test(
  flavor: StatusBoxFlavorName,
  testingBodyText: string,
  headlineText: string,
  expectMinimized: boolean
) {
  cy.get("div.status-box").should((statusBox) => {
    expect(statusBox).to.have.css(
      "color",
      hexToRgb(
        getCurrentColor(getColorNameComplementFromPlainColorName(flavor))
      )
    );
    expect(statusBox).to.have.css(
      "background-color",
      hexToRgb(getCurrentColor(getColorNameFromPlainColorName(flavor)))
    );
    expect(statusBox).to.have.attr(
      "title",
      expectMinimized ? `Expand: \n${headlineText}` : ""
    );
  });
  if (expectMinimized) {
    cy.get("div.status-box div").should((statusBoxDiv) => {
      expect(statusBoxDiv).to.not.exist;
    });
    cy.get("h3 span").should((h3Span) => {
      expect(h3Span).to.not.exist;
    });
  } else {
    cy.get("div.status-box div").should((statusBoxDiv) => {
      expect(statusBoxDiv).to.have.length(1);
      expect(statusBoxDiv).to.contain.text(testingBodyText);
    });
    cy.get("h3 span").should((h3Span) => {
      expect(h3Span).to.have.length(1);
      expect(h3Span).to.contain.text(headlineText);
    });
  }
  cy.get("h3").should((h3) => {
    expect(h3).to.have.attr(
      "title",
      expectMinimized ? `Expand: \n${headlineText}` : "Minimize"
    );
  });
  cy.get("svg").should((svg) => {
    expect(svg).to.have.length(1);
    expect(svg).to.have.class(getIconClassName(getFlavorItem(flavor).icon));
  });
}

describe("StatusBox component", () => {
  for (const flavor of getAllStatusBoxFlavors()) {
    describe(`State = ${flavor}`, () => {
      const title = `Testing state ${flavor}`;
      const testingText = `Testing text for ${flavor}...`;
      it("Renders and switches minimized", () => {
        cy.mount(StatusBox, {
          props: { headlineText: title, boxFlavorName: flavor },
          slots: { default: testingText },
        });
        test(flavor, testingText, title, false);

        // minimizing and un-minimizing
        cy.get("div.status-box").click("bottom"); // outside h3
        test(flavor, testingText, title, false);
        cy.get("h3").click();
        test(flavor, testingText, title, true);
        cy.get("div.status-box").click("bottom"); // outside h3
        test(flavor, testingText, title, false);
        cy.get("h3").click();
        test(flavor, testingText, title, true);
        cy.get("h3").click();
        test(flavor, testingText, title, false);
      });
      it("Renders minimized", () => {
        cy.mount(StatusBox, {
          props: {
            headlineText: title,
            boxFlavorName: flavor,
            initializeMinimized: true,
          },
          slots: { default: testingText },
        });
        test(flavor, testingText, title, true);
        cy.get("div.status-box").click();
        test(flavor, testingText, title, false);
      });
    });
  }
});
