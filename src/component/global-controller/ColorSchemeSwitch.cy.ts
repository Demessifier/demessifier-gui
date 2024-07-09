import ColorSchemeSwitch from "./ColorSchemeSwitch.vue";
import {
  supportedColorSchemes,
  getColorSchemeConfiguredOrPreferred,
  Scheme,
} from "../../provider/color-scheme";
import { createTestingPinia } from "@pinia/testing";

function selectScheme(scheme: Scheme) {
  cy.get("select").select(scheme);
}

function checkThatEachOptionIsPresent() {
  for (const scheme of supportedColorSchemes) {
    cy.get(`select option[value=${scheme}]`).should((option) => {
      expect(option).to.have.length(1);
    });
  }
}

function checkAllOptions(scheme: Scheme) {
  cy.get("select option").each((o: JQuery<HTMLOptionElement>) => {
    cy.wrap(o).should((option: JQuery<HTMLOptionElement>) => {
      if (option.is(":selected")) {
        expect(option).to.have.value(scheme);
      } else {
        expect(option).not.to.have.value(scheme);
      }
    });
  });
}

describe("ColorSchemeSwitch component", function () {
  beforeEach(() => {
    cy.mount(ColorSchemeSwitch, {
      global: {
        plugins: [
          createTestingPinia({ stubActions: false, createSpy: cy.spy }),
        ],
      },
    });
  });

  it("has all options present", () => {
    checkThatEachOptionIsPresent();
  });

  it("renders with the correct scheme active", () => {
    const activeScheme: Scheme = getColorSchemeConfiguredOrPreferred();
    checkAllOptions(activeScheme);
  });

  describe("select dark", () => {
    beforeEach(() => {
      selectScheme("dark");
    });

    it("has all options present", () => {
      checkThatEachOptionIsPresent();
    });

    it("has the correct scheme active", () => {
      checkAllOptions("dark");
    });

    describe("select light", () => {
      beforeEach(() => {
        selectScheme("light");
      });

      it("has all options present", () => {
        checkThatEachOptionIsPresent();
      });

      it("has the correct scheme active", () => {
        checkAllOptions("light");
      });

      describe("select light again", () => {
        beforeEach(() => {
          selectScheme("light");
        });

        it("has all options present", () => {
          checkThatEachOptionIsPresent();
        });

        it("has the correct scheme active", () => {
          checkAllOptions("light");
        });

        describe("select dark", () => {
          beforeEach(() => {
            selectScheme("dark");
          });

          it("has all options present", () => {
            checkThatEachOptionIsPresent();
          });

          it("has the correct scheme active", () => {
            checkAllOptions("dark");
          });
        });
      });
    });
  });
});
