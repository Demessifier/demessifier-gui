import MainHeaderLogo from "./MainHeaderLogo.vue";
import { headerLogoExample } from "../../model/logo-section";

describe("MainHeaderLogo component", () => {
  it(`Renders`, () => {
    cy.mount(MainHeaderLogo, { props: { logoSections: headerLogoExample } });
    cy.get("div.logo-wrapper div").should((divItems) => {
      expect(divItems).to.have.length(headerLogoExample.length);
      headerLogoExample.forEach((sectionDefinition, index) => {
        const sectionRendered = divItems[index];
        switch (sectionDefinition.logoSectionType) {
          case "text-title":
          case "text-subtitle":
            expect(sectionDefinition.logoSectionText).to.be.ok;
            expect(sectionDefinition.logoSectionSvgMask).not.to.be.ok;
            expect(sectionRendered).to.have.text(
              sectionDefinition.logoSectionText ?? "",
            );
            break;
          case "svg-mask-square":
            expect(sectionDefinition.logoSectionText).not.to.be.ok;
            expect(sectionDefinition.logoSectionSvgMask).to.be.ok;
            for (const maskImage of ["-webkit-mask-image", "mask-image"]) {
              expect(sectionRendered)
                .to.have.css(maskImage)
                .match(
                  RegExp(
                    "^url(.*" + sectionDefinition.logoSectionSvgMask + ".*)$",
                  ),
                );
            }
            break;
          default:
            expect(false).to.be.true; // there should not be any other section type
        }
      });
    });
  });
});
