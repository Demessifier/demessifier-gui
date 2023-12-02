import { test, expect } from "vitest";
import {
  colorSchemes,
  getColorScheme,
  getPreferredColorScheme,
  setColorScheme,
} from "./color-scheme";
import { getRandomItem } from "./randomness";

test("Color scheme", async () => {
  expect(colorSchemes).to.have.length(2);
  expect(colorSchemes).to.contain(getPreferredColorScheme());

  let previousScheme = getColorScheme();
  for (let _i = 0; _i < 10 * colorSchemes.length; _i++) {
    const randomScheme = getRandomItem(colorSchemes, [previousScheme]);
    setColorScheme(randomScheme);
    const activeScheme = getColorScheme();
    expect(activeScheme).to.be.equal(randomScheme);
    expect(colorSchemes).to.contain(activeScheme);
    previousScheme = randomScheme;
  }
});

// TODO: test actually getting a real value from getPreferredColorScheme().
//       We are using a mock in vitest-setup/setup.ts that always returns the default value
