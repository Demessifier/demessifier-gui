import FaIconWrapper from "./FontAwesomeIcon.vue";
import { FaIcon, faIconInit } from "../provider/fa-icon";

const iconExamples: FaIcon[] = ["fas-bars", "fas-chevron-down"];

describe("FaIconWrapper component", () => {
  faIconInit();
  for (const icon of iconExamples) {
    const title = `Testing title of ${icon} icon`;
    it(`Renders ${icon}`, () => {
      cy.mount(FaIconWrapper, { props: { icon: icon, title: title } });
      cy.get("svg").should((svg) => {
        expect(svg).to.have.length(1);
      });
      cy.get("svg title").should((svgTitle) => {
        expect(svgTitle).to.contain.text(title);
      });
    });
    it(`Spins ${icon}`, () => {
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
