import StatusBox from "./StatusBox.vue";

function test(
  state: string,
  testingBodyText: string,
  headerText: string,
  expectMinimized: boolean
) {
  cy.get("div.status-box")
    .should("have.css", "color", "rgb(255, 255, 255)")
    .should("have.css", "background-color", "rgb(0, 0, 139)")
    .should(
      "have.attr",
      "title",
      expectMinimized ? `Show: \n${headerText}` : ""
    );
  if (expectMinimized) {
    cy.get("div.status-box div").should("have.length", 0);
    cy.get("h3 span").should("have.length", 0);
  } else {
    cy.get("div.status-box div")
      .should("have.length", 1)
      .should("contain.text", testingBodyText);
    cy.get("h3 span")
      .should("have.length", 1)
      .should("contain.text", headerText);
  }
  cy.get("h3").should(
    "have.attr",
    "title",
    expectMinimized ? `Show: \n${headerText}` : "Minimize"
  );
}

describe("<StatusBox />", () => {
  const state = "default";
  const title = `Testing state ${state}`;
  const testingText = `Testing text for ${state}...`;
  it(`renders ${state}`, () => {
    // see: https://test-utils.vuejs.org/guide/
    cy.mount(StatusBox, {
      props: { headerText: title },
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
  it(`renders ${state} minimized`, () => {
    // see: https://test-utils.vuejs.org/guide/
    cy.mount(StatusBox, {
      props: {
        headerText: title,
        initializeMinimized: true,
      },
      slots: { default: testingText },
    });
    test(state, testingText, title, true);
    cy.get("div.status-box").click();
    test(state, testingText, title, false);
  });
});
