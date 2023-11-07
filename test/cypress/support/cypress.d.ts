import { ComponentMountingOptions, Vue } from "vue";

declare global {
  namespace Cypress {
    interface Chainable {
      mount<Component extends Vue>(
        component: Component,
        options?: ComponentMountingOptions<Component>
      ): Chainable<any>;
    }
  }
}
