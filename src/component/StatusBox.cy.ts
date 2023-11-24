import StatusBox from "./StatusBox.vue";
import { statusBoxIcons } from "../provider/status-box";
import { getIconClassName } from "../provider/fa-icon";

function test(
  state: string,
  testingBodyText: string,
  headerText: string,
  expectMinimized: boolean
) {
  cy.get("div.status-box").should((statusBox) => {
    expect(statusBox).to.have.css("color", "rgb(255, 255, 255)");
    expect(statusBox).to.have.css("background-color", "rgb(0, 0, 139)");
    expect(statusBox).to.have.attr(
      "title",
      expectMinimized ? `Show: \n${headerText}` : ""
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
      expect(h3Span).to.contain.text(headerText);
    });
  }
  cy.get("h3").should((h3) => {
    expect(h3).to.have.attr(
      "title",
      expectMinimized ? `Show: \n${headerText}` : "Minimize"
    );
  });
  cy.get("svg").should((svg) => {
    expect(svg).to.have.length(1);
    expect(svg).to.have.class(getIconClassName(statusBoxIcons[state]));
  });
}

describe("<StatusBox />", () => {
  for (const state of Object.keys(statusBoxIcons)) {
    describe(`State = ${state}`, () => {
      const title = `Testing state ${state}`;
      const testingText = `Testing text for ${state}...`;
      it("renders and switches minimized", () => {
        // see: https://test-utils.vuejs.org/guide/
        cy.mount(StatusBox, {
          props: { headerText: title, boxTypeName: state },
          slots: { default: testingText },
        });
        test(state, testingText, title, false);

        // minimizing and un-minimizing
        cy.get("div.status-box").click("bottom"); // outside h3
        test(state, testingText, title, false);
        cy.get("h3").click();
        test(state, testingText, title, true);
        cy.get("div.status-box").click("bottom"); // outside h3
        test(state, testingText, title, false);
        cy.get("h3").click();
        test(state, testingText, title, true);
        cy.get("h3").click();
        test(state, testingText, title, false);
      });
      it("renders minimized", () => {
        // see: https://test-utils.vuejs.org/guide/
        cy.mount(StatusBox, {
          props: {
            headerText: title,
            boxTypeName: state,
            initializeMinimized: true,
          },
          slots: { default: testingText },
        });
        test(state, testingText, title, true);
        cy.get("div.status-box").click();
        test(state, testingText, title, false);
      });
    });
  }
});
