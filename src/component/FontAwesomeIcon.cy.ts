import FaIconWrapper from "./FontAwesomeIcon.vue";
import { FaIcon, faIconInit } from "../provider/fa-icon";

const iconExamples: FaIcon[] = ["fas-bars", "fas-chevron-down"];

describe("<FaIconWrapper />", () => {
  faIconInit();
  for (const icon of iconExamples) {
    const title = `Testing title of ${icon} icon`;
    it(`renders ${icon}`, () => {
      // see: https://test-utils.vuejs.org/guide/
      cy.mount(FaIconWrapper, { props: { icon: icon, title: title } });
      cy.get("svg").should((svg) => {
        expect(svg).to.have.length(1);
      });
      cy.get("svg title").should((svgTitle) => {
        expect(svgTitle).to.contain.text(title);
      });
    });
    it(`spins ${icon}`, () => {
      // see: https://test-utils.vuejs.org/guide/
      cy.mount(FaIconWrapper, {
        props: { icon: icon, title: title, spin: true },
      });
      cy.get("svg").should((svg) => {
        expect(svg).to.have.length(1);
      });
      cy.get("svg title").should((svgTitle) => {
        expect(svgTitle).to.contain.text(title);
      });
    });
  }
});
