import ButtonWithIconLink from "./ButtonWithIconLink.vue";
import { faIcons, faLink } from "@fortawesome/free-solid-svg-icons";
import { type IconDefinition } from "@fortawesome/fontawesome-svg-core";

const defaultIcon: IconDefinition = faIcons;
const defaultText: string = "Button text";
const defaultHref: string = "http://test.com";

describe("ButtonWithIconLink component", () => {
  describe("renders icon", () => {
    it("works with defaults", () => {
      cy.mount(ButtonWithIconLink, {
        props: { icon: defaultIcon, text: defaultText, href: defaultHref },
      });
      cy.get("a")
        .should((a) => {
          expect(a).to.have.attr("href", defaultHref);
          expect(a).not.to.have.attr("target");
          expect(a).not.to.have.attr("rel");
        })
        .find("button")
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
          cy.mount(ButtonWithIconLink, {
            props: { icon: icon, text: defaultText, href: defaultHref },
          });
          cy.get("a")
            .should((a) => {
              expect(a).to.have.attr("href", defaultHref);
              expect(a).not.to.have.attr("target");
              expect(a).not.to.have.attr("rel");
            })
            .find("button")
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
          cy.mount(ButtonWithIconLink, {
            props: { icon: defaultIcon, text: text, href: defaultHref },
          });
          cy.get("a")
            .should((a) => {
              expect(a).to.have.attr("href", defaultHref);
              expect(a).not.to.have.attr("target");
              expect(a).not.to.have.attr("rel");
            })
            .find("button")
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
          cy.mount(ButtonWithIconLink, {
            props: {
              icon: defaultIcon,
              text: defaultText,
              type: type,
              href: defaultHref,
            },
          });
          cy.get("a")
            .should((a) => {
              expect(a).to.have.attr("href", defaultHref);
              expect(a).not.to.have.attr("target");
              expect(a).not.to.have.attr("rel");
            })
            .find("button")
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
          cy.mount(ButtonWithIconLink, {
            props: {
              icon: defaultIcon,
              text: defaultText,
              disabled: disabled,
              href: defaultHref,
            },
          });
          cy.get("a")
            .should((a) => {
              expect(a).to.have.attr("href", defaultHref);
              expect(a).not.to.have.attr("target");
              expect(a).not.to.have.attr("rel");
            })
            .find("button")
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
        });
      }
    });

    describe("works with href", () => {
      for (const href of [
        "http://test.com",
        "https://test.com",
        "https://test.com/",
        "https://test.com/path/to/file.txt",
        "/path/to/file.txt",
        "path/to/file.txt",
        "/",
        "#",
        "javascript/script.js",
        "/javascript/script.js",
        "./javascript/script.js",
        "javascript:alert('Hello, world!')",
      ]) {
        const sanitizedHref = href.startsWith("javascript:") ? "#" : href;
        it(`works with href ${href}`, () => {
          cy.mount(ButtonWithIconLink, {
            props: {
              icon: defaultIcon,
              text: defaultText,
              href: href,
            },
          });
          cy.get("a")
            .should((a) => {
              expect(a).to.have.attr("href", sanitizedHref);
              expect(a).not.to.have.attr("target");
              expect(a).not.to.have.attr("rel");
            })
            .find("button")
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

    describe("works with new tab", () => {
      for (const newTab of [true, false]) {
        it(`works with new tab ${newTab}`, () => {
          cy.mount(ButtonWithIconLink, {
            props: {
              icon: defaultIcon,
              text: defaultText,
              href: defaultHref,
              openInNewTab: newTab,
            },
          });
          cy.get("a")
            .should((a) => {
              expect(a).to.have.attr("href", defaultHref);
              if (newTab) {
                expect(a).to.have.attr("target", "_blank");
                expect(a).to.have.attr("rel", "noreferrer noopener");
              } else {
                expect(a).not.to.have.attr("target");
                expect(a).not.to.have.attr("rel");
              }
            })
            .find("button")
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
  });
});
