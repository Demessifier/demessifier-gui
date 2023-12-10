import { test, expect } from "vitest";
import {
  supportedColorSchemes,
  getColorSchemeConfigured,
  getColorSchemeConfiguredOrPreferred,
  getColorSchemePreferredOrDefault,
  setColorScheme,
} from "./color-scheme";
import { getRandomItem } from "./randomness";

test("Color scheme", async () => {
  expect(supportedColorSchemes).to.have.length(2);
  expect(supportedColorSchemes).to.contain(getColorSchemePreferredOrDefault());
  expect(supportedColorSchemes).to.contain(
    getColorSchemeConfiguredOrPreferred()
  );

  let previousScheme = getColorSchemeConfigured();
  for (let _i = 0; _i < 10 * supportedColorSchemes.length; _i++) {
    const randomScheme = getRandomItem(supportedColorSchemes, [previousScheme]);
    expect(randomScheme).to.be.ok;
    setColorScheme(randomScheme as string);
    const activeScheme = getColorSchemeConfigured();
    const schemeCP = getColorSchemeConfiguredOrPreferred();
    expect(activeScheme).to.be.equal(randomScheme);
    expect(activeScheme).to.be.equal(schemeCP);
    expect(supportedColorSchemes).to.contain(activeScheme);
    previousScheme = randomScheme;
  }
});

// TODO: test actually getting a real value from getPreferredColorScheme().
//       We are using a mock in vitest-setup/setup.ts that always returns the default value
