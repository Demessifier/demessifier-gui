import ColorSchemeSwitch from "./ColorSchemeSwitch.vue";
import {
  supportedColorSchemes,
  getColorSchemeConfigured,
  getColorSchemeConfiguredOrPreferred,
  Scheme,
} from "../../provider/color-scheme";
import { getRandomItem } from "../../provider/randomness";

describe("ColorSchemeSwitch component", () => {
  for (const scheme of supportedColorSchemes) {
    it(`Renders ${scheme}`, () => {
      cy.mount(ColorSchemeSwitch);
      const button_selector = `button#scheme-switch-${scheme}`;
      cy.get(button_selector).should((btn) => {
        expect(btn).to.contain.text(`Switch to ${scheme} scheme`);

        if (scheme === getColorSchemeConfigured()) {
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
    let activeScheme: Scheme = getColorSchemeConfiguredOrPreferred();
    for (let _i = 0; _i < 10 * supportedColorSchemes.length; _i++) {
      const randomScheme: Scheme = getRandomItem(supportedColorSchemes, [
        activeScheme,
      ]);

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
