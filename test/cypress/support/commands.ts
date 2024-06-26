/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

import { mount } from "cypress/vue";
import "@cypress/code-coverage/support";

Cypress.Commands.add("mount", (component, options = {}) => {
  // Setup options object
  options.global ||= {};
  options.global.stubs ||= {};
  options.global.stubs["transition"] = false;
  options.global.components ||= {};
  options.global.plugins ||= [];

  /* Add any global plugins */
  // options.global.plugins.push({
  //   install(app) {
  //     app.use(MyPlugin);
  //   },
  // });

  /* Add any global components */
  // options.global.components['Button'] = Button;

  return mount(component, options);
});

Cypress.Commands.add("vueWrap", () => {
  // Taken from https://stackoverflow.com/a/70213943/8682210
  return cy.wrap(Cypress.vueWrapper);
});

Cypress.Commands.add("expectEmitCount", (eventName, count) => {
  // Inspired by https://stackoverflow.com/a/70213943/8682210
  return cy
    .wrap(Cypress.vueWrapper.emitted(eventName))
    .should((wrapperEmitted) => {
      if (count == 0) {
        expect(wrapperEmitted).to.be.undefined;
      } else {
        expect(wrapperEmitted).to.have.length(count);
      }
    });
});
