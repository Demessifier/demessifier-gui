import ButtonWithIcon from "./ButtonWithIcon.vue";
import { faIcons, faLink } from "@fortawesome/free-solid-svg-icons";
import { type IconDefinition } from "@fortawesome/fontawesome-svg-core";

const defaultIcon: IconDefinition = faIcons;
const defaultText: string = "Button text";

describe("ButtonWithIcon component", () => {
  describe("renders icon", () => {
    it("works with defaults", () => {
      cy.mount(ButtonWithIcon, {
        props: { icon: defaultIcon, text: defaultText },
      });
      cy.get("button")
        .should((button) => {
          expect(button).to.contain.text(defaultText);
          expect(button).to.have.attr("type");
          expect(button).not.to.have.attr("disabled");
        })
        .find("svg")
        .should((svg) => {
          expect(svg).to.have.length(1);
          expect(svg).to.have.class(`fa-${defaultIcon.iconName}`);
        });
    });

    describe("works with icons", () => {
      for (const icon of [faIcons, faLink, undefined]) {
        it(`works with icon ${icon?.iconName}`, () => {
          cy.mount(ButtonWithIcon, {
            props: { icon: icon, text: defaultText },
          });
          cy.get("button")
            .should((button) => {
              expect(button).to.contain.text(defaultText);
              expect(button).to.have.attr("type");
              expect(button).not.to.have.attr("disabled");
            })
            .find("svg")
            .should((svg) => {
              if (icon) {
                expect(svg).to.have.length(1);
                expect(svg).to.have.class(`fa-${icon.iconName}`);
              } else {
                expect(svg).not.to.exist;
              }
            });
        });
      }
    });

    describe("works with texts", () => {
      const loremIpsum =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam ullamcorper sapien vitae tortor finibus ornare. In eget condimentum augue. Curabitur eget fringilla sapien, a scelerisque risus.";
      for (const text of ["short text", loremIpsum, ""]) {
        it(`works with text ${text.split(" ", 2)[0]}`, () => {
          cy.mount(ButtonWithIcon, {
            props: { icon: defaultIcon, text: text },
          });
          cy.get("button")
            .should((button) => {
              expect(button).to.contain.text(text);
              expect(button).to.have.attr("type");
              expect(button).not.to.have.attr("disabled");
            })
            .find("svg")
            .should((svg) => {
              expect(svg).to.have.length(1);
              expect(svg).to.have.class(`fa-${defaultIcon.iconName}`);
            });
        });
      }
    });

    describe("works with types", () => {
      for (const type of ["button", "reset", "submit"]) {
        it(`works with type ${type}`, () => {
          cy.mount(ButtonWithIcon, {
            props: { icon: defaultIcon, text: defaultText, type: type },
          });
          cy.get("button")
            .should((button) => {
              expect(button).to.contain.text(defaultText);
              expect(button).to.have.attr("type");
              expect(button).not.to.have.attr("disabled");
            })
            .find("svg")
            .should((svg) => {
              expect(svg).to.have.length(1);
              expect(svg).to.have.class(`fa-${defaultIcon.iconName}`);
            });
        });
      }
    });

    describe("works with disabled", () => {
      for (const disabled of [true, false]) {
        it(`works with disabled ${disabled}`, () => {
          const buttonFunction = cy.stub();
          cy.mount(ButtonWithIcon, {
            props: {
              icon: defaultIcon,
              text: defaultText,
              disabled: disabled,
              onClick: buttonFunction,
            },
          });
          cy.get("button")
            .should((button) => {
              expect(button).to.contain.text(defaultText);
              expect(button).to.have.attr("type");
              if (disabled) {
                expect(button).to.have.attr("disabled", "disabled");
              } else {
                expect(button).not.to.have.attr("disabled");
              }
            })
            .find("svg")
            .should((svg) => {
              expect(svg).to.have.length(1);
              expect(svg).to.have.class(`fa-${defaultIcon.iconName}`);
            });
          cy.then(() => {
            expect(buttonFunction).not.to.be.called;
          });
          if (!disabled) {
            cy.get("button")
              .click()
              .then(() => {
                expect(buttonFunction).to.be.called;
              });
          }
        });
      }
    });
  });
});
