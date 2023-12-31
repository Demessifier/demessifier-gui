import { test, expect } from "vitest";
import {
  supportedColorSchemes,
  getColorSchemeConfigured,
  getColorSchemeConfiguredOrPreferred,
  getColorSchemePreferredOrDefault,
  setColorScheme,
} from "./color-scheme";
import { getRandomItem } from "./randomness";
import { ensureMetaTagContent, getMetaTagContent } from "./html-meta-tag";
import MatchMediaMock from "vitest-matchmedia-mock";

function testSchemeName(schemeName: string | null, expectedResult: string) {
  const META_TAG_COLOR_SCHEME = "color-scheme";

  const schemaNameUsed = schemeName ?? "jkl";
  ensureMetaTagContent(META_TAG_COLOR_SCHEME, schemaNameUsed);
  expect(getMetaTagContent(META_TAG_COLOR_SCHEME)).to.be.equal(schemaNameUsed);
  expect(supportedColorSchemes).to.contain(getColorSchemePreferredOrDefault());

  const configuredOrPreferred = getColorSchemeConfiguredOrPreferred();
  expect(supportedColorSchemes).to.contain(expectedResult);
  expect(configuredOrPreferred).to.be.equal(expectedResult);

  const matchMediaMock = new MatchMediaMock();
  matchMediaMock.useMediaQuery("(prefers-color-scheme: dark)");
  expect(supportedColorSchemes).to.contain(getColorSchemePreferredOrDefault());
  matchMediaMock.clear();
  matchMediaMock.destroy();
}

test("Color scheme", async () => {
  expect(supportedColorSchemes).to.have.length(2);
  expect(supportedColorSchemes).to.contain(getColorSchemePreferredOrDefault());
  expect(supportedColorSchemes).to.contain(
    getColorSchemeConfiguredOrPreferred()
  );

  testSchemeName("light", "light");
  testSchemeName("dark-ish", "dark");
  testSchemeName("darkblue", "dark");
  testSchemeName(null, supportedColorSchemes[0]);

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
