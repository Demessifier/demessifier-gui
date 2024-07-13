import MenuLeft from "./MenuLeft.vue";
import { menuExample } from "../../provider/menu";

describe("MenuLeft component", () => {
  it(`renders`, () => {
    // see: https://test-utils.vuejs.org/guide/
    cy.mount(MenuLeft, { props: { menuItems: menuExample } });
    cy.get("menu li").should("have.length", menuExample.length);
    for (const menuItem of menuExample) {
      cy.get(`menu li router-link[to="${menuItem.path}"]`).should(
        "have.length",
        1,
      );
      cy.get(`menu li router-link[to="${menuItem.path}"] svg`).should(
        "have.length",
        1,
      );
      cy.get(`menu li router-link[to="${menuItem.path}"] span.menu-title`)
        .should("have.length", 1)
        .should("contain.text", menuItem.title);
    }
  });
});
