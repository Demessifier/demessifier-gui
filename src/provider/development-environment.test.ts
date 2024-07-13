import { test, expect, expectTypeOf } from "vitest";
import * as devEnv from "./development-environment";

test("Development Environment", async () => {
  expect(devEnv).to.be.ok;

  // We really don't want to release with any value that is not a boolean false
  expectTypeOf(devEnv.DEVELOPMENT).toMatchTypeOf<boolean>();
  expect(devEnv.DEVELOPMENT).to.be.false;
});
