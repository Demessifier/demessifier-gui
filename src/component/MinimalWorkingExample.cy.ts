import MinimalWorkingExample from "./MinimalWorkingExample.vue";

describe("<MinimalWorkingExample />", () => {
  it("renders", () => {
    cy.mount(MinimalWorkingExample, {
      props: { headerText: "Testing" },
      slots: { default: "Testing text ..." },
    });
  });
});
