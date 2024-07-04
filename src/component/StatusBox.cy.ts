import StatusBox from "./StatusBox.vue";
import {
  getAllStatusBoxFlavors,
  getFlavorItem,
  StatusBoxFlavorName,
} from "../provider/status-box";
import {
  getColorNameComplementFromPlainColorName,
  getColorNameFromPlainColorName,
  getCurrentColor,
} from "../provider/color-palette";

function test(
  flavor: StatusBoxFlavorName,
  testingBodyText: string,
  headlineText: string,
  expectMinimized: boolean,
) {
  cy.get("div.status-box").should((statusBox) => {
    expect(statusBox).to.have.attr(
      "title",
      expectMinimized ? `Expand: \n${headlineText}` : "",
    );
  });
  cy.get("div.status-box div.header").should((statusBoxHeader) => {
    expect(statusBoxHeader).to.have.css(
      "color",
      getCurrentColor(getColorNameComplementFromPlainColorName(flavor))
        .rgbString,
    );
    expect(statusBoxHeader).to.have.css(
      "background-color",
      getCurrentColor(getColorNameFromPlainColorName(flavor)).rgbString,
    );
    expect(statusBoxHeader).to.have.attr(
      "title",
      expectMinimized ? `Expand: \n${headlineText}` : "Minimize",
    );
  });
  if (expectMinimized) {
    cy.get("div.status-box div.content").should((statusBoxDivContent) => {
      expect(statusBoxDivContent).to.not.exist;
    });
    cy.get("h3 span").should((h3Span) => {
      expect(h3Span).to.not.exist;
    });
  } else {
    cy.get("div.status-box div.content").should((statusBoxDivContent) => {
      expect(statusBoxDivContent).to.have.length(1);
      expect(statusBoxDivContent).to.contain.text(testingBodyText);
    });
    cy.get("h3 span").should((h3Span) => {
      expect(h3Span).to.have.length(1);
      expect(h3Span).to.contain.text(headlineText);
    });
  }
  cy.get("svg").should((svg) => {
    expect(svg).to.have.length(1);
    expect(svg).to.have.class(`fa-${getFlavorItem(flavor).icon.iconName}`);
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
  describe("Buttons row", () => {
    for (const canBeClosed of [true, false]) {
      for (const canBePinned of [true, false]) {
        it(`Works for canBeClosed=${canBeClosed} canBePinned=${canBePinned}`, () => {
          cy.mount(StatusBox, {
            props: {
              headlineText: "Buttons test",
              boxFlavorName: getAllStatusBoxFlavors()[0],
              canBeClosed: canBeClosed,
              canBePinned: canBePinned,
            },
            slots: {
              default: `canBeClosed=${canBeClosed} canBePinned=${canBePinned}`,
            },
          });
          cy.get("div.buttons").should((buttonsDiv) => {
            expect(buttonsDiv).to.have.length(
              canBeClosed || canBePinned ? 1 : 0,
            );
          });
          cy.get("div.buttons span.icon-button").should((buttonIcons) => {
            expect(buttonIcons).to.have.length(
              canBeClosed || canBePinned ? 2 : 0,
            );
          });
          cy.get("div.buttons span.icon-button.pin > *").should(
            (buttonIcons) => {
              expect(buttonIcons).to.have.length(canBePinned ? 1 : 0);
            },
          );
          cy.get("div.buttons span.icon-button.close > *").should(
            (buttonIcons) => {
              expect(buttonIcons).to.have.length(canBeClosed ? 1 : 0);
            },
          );

          let closeCount = 0;
          let pinCount = 0;

          cy.expectEmitCount("interrupt-count-down", pinCount);
          cy.expectEmitCount("close-status-box", closeCount);

          if (canBePinned) {
            cy.get("div.buttons span.icon-button.pin > *").click();
            cy.expectEmitCount("interrupt-count-down", ++pinCount);

            cy.expectEmitCount("close-status-box", closeCount);

            cy.get("div.buttons span.icon-button.pin > *").click();
            cy.expectEmitCount("interrupt-count-down", ++pinCount);
          }

          if (canBeClosed) {
            cy.get("div.buttons span.icon-button.close > *").click();
            cy.expectEmitCount("close-status-box", ++closeCount);

            cy.expectEmitCount("interrupt-count-down", pinCount);

            cy.get("div.buttons span.icon-button.close > *").click();
            cy.expectEmitCount("close-status-box", ++closeCount);
          }
        });
      }
    }
  });
});
