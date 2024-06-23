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
    for (const closable of [true, false]) {
      for (const fading of [true, false]) {
        it(`Works for closable=${closable} fading=${fading}`, () => {
          cy.mount(StatusBox, {
            props: {
              headlineText: "Buttons test",
              boxFlavorName: getAllStatusBoxFlavors()[0],
              closable: closable,
              fading: fading,
            },
            slots: { default: `closable=${closable} fading=${fading}` },
          });
          cy.get("div.buttons").should((buttonsDiv) => {
            expect(buttonsDiv).to.have.length(closable || fading ? 1 : 0);
          });
          cy.get("div.buttons span.icon-button").should((buttonIcons) => {
            expect(buttonIcons).to.have.length(closable || fading ? 2 : 0);
          });
          cy.get("div.buttons span.icon-button.pin > *").should(
            (buttonIcons) => {
              expect(buttonIcons).to.have.length(fading ? 1 : 0);
            },
          );
          cy.get("div.buttons span.icon-button.close > *").should(
            (buttonIcons) => {
              expect(buttonIcons).to.have.length(closable ? 1 : 0);
            },
          );

          let closeCount = 0;
          let pinCount = 0;

          cy.expectEmitCount("interrupt-count-down", pinCount);
          cy.expectEmitCount("close-status-box", closeCount);

          if (fading) {
            cy.get("div.buttons span.icon-button.pin > *").click();
            cy.expectEmitCount("interrupt-count-down", ++pinCount);

            cy.expectEmitCount("close-status-box", closeCount);

            cy.get("div.buttons span.icon-button.pin > *").click();
            cy.expectEmitCount("interrupt-count-down", ++pinCount);
          }

          if (closable) {
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
  /* TODO: move to Notifications Area tests
  describe("Disappears in time", () => {
    const timeoutSeconds = 2;
    it(`${timeoutSeconds} seconds`, () => {
      cy.mount(StatusBox, {
        props: {
          headlineText: `Gonna disappear in ${timeoutSeconds} seconds`,
          boxFlavorName: getAllStatusBoxFlavors()[0],
          removeInSeconds: timeoutSeconds,
        },
        slots: { default: "Our time is running out..." },
      });
      cy.get("div.status-box").trigger("mouseleave");
      const endTimeMillis = Date.now() + timeoutSeconds * 1000;

      const multiplier = 2;
      for (let i = timeoutSeconds * multiplier + 2; i > 0; i--) {
        cy.get("div.status-box").should((statusBox) => {
          const nowMilliSeconds = Date.now();
          if (nowMilliSeconds + 250 < endTimeMillis) {
            // it should still exist
            expect(statusBox).to.exist;
          } else if (nowMilliSeconds > endTimeMillis) {
            // it shouldn't exist anymore
            expect(statusBox).not.to.exist;
          }
        });
        cy.wait(1000 / multiplier);
      }
      // it shouldn't exist anymore
      cy.get("div.status-box").should((statusBox) => {
        expect(statusBox).to.not.exist;
      });
    });
  });
  */
});
