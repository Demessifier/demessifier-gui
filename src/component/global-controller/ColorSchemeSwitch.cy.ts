import ColorSchemeSwitch from "./ColorSchemeSwitch.vue";
import {
  colorSchemes,
  getColorScheme,
  Scheme,
} from "../../provider/color-scheme";
import { getRandomItem } from "../../provider/randomness";

describe("ColorSchemeSwitch component", () => {
  for (const scheme of colorSchemes) {
    it(`Renders ${scheme}`, () => {
      cy.mount(ColorSchemeSwitch);
      const button_selector = `button#scheme-switch-${scheme}`;
      cy.get(button_selector).should((btn) => {
        expect(btn).to.contain.text(`Switch to ${scheme} scheme`);

        if (scheme === getColorScheme()) {
          expect(btn).to.have.attr("disabled", "disabled");
        } else {
          expect(btn).to.not.have.attr("disabled");
        }
      });
      cy.get(`${button_selector} svg`).should((svg) => {
        expect(svg).to.have.length(1);
      });
    });
  }
  it("Switches (epilepsy warning when watching this)", () => {
    cy.mount(ColorSchemeSwitch);
    let activeScheme: Scheme = getColorScheme();
    for (let _i = 0; _i < 10 * colorSchemes.length; _i++) {
      const randomScheme: Scheme = getRandomItem(colorSchemes, [activeScheme]);

      cy.get(`button#scheme-switch-${activeScheme}`).should((btn) => {
        expect(btn).to.have.attr("disabled", "disabled");
      });

      cy.get(`button#scheme-switch-${randomScheme}`)
        .should((btn) => {
          expect(btn).to.not.have.attr("disabled");
        })
        .click()
        .should((btn) => {
          expect(btn).to.have.attr("disabled", "disabled");
        });
      activeScheme = randomScheme;
    }
  });
});
