import { ensureMetaTagContent, getMetaTagContent } from "./html-meta-tag";

const colorSchemesDefinition = ["dark", "light"];
/**
 * Supported values of color scheme names.
 */
export type Scheme = (typeof colorSchemesDefinition)[number];
/**
 * List of supported color schemes.
 */
export const supportedColorSchemes = Object.freeze(
  colorSchemesDefinition,
) as Scheme[];

/**
 * Sets a color scheme to the "color-scheme" meta tag.
 * @param scheme The value to be set.
 */
export function setColorScheme(scheme: Scheme) {
  ensureMetaTagContent("color-scheme", scheme);
}

/**
 * Gets the currently set color scheme in the "color-scheme" meta tag.
 * @returns The currently set color scheme.
 */
export function getColorSchemeConfigured(): Scheme | undefined {
  const configuredScheme = getMetaTagContent("color-scheme");

  // nothing found
  if (!configuredScheme) return undefined;

  // found one of the supported - exactly
  if (supportedColorSchemes.some((o) => o === configuredScheme))
    return configuredScheme;

  // found one of the supported - substring whole word
  for (const supportedScheme of supportedColorSchemes) {
    if (configuredScheme.match(`\\b${supportedScheme}\\b`))
      return supportedScheme;
  }

  // found one of the supported - substring
  for (const supportedScheme of supportedColorSchemes) {
    if (configuredScheme.match(supportedScheme)) return supportedScheme;
  }

  // nothing useful found
  return undefined;
}

/**
 * Obtains the preferred color scheme from the browser.
 * If none of the supported schemes is preferred, returns the first supported scheme.
 * @returns The preferred scheme if it is supported. The first supported scheme otherwise.
 */
export function getColorSchemePreferredOrDefault(): Scheme {
  for (const colorScheme of supportedColorSchemes) {
    if (window.matchMedia(`(prefers-color-scheme: ${colorScheme})`).matches)
      return colorScheme;
  }
  return supportedColorSchemes[0];
}

/**
 * Gets the currently set color scheme in the "color-scheme" meta tag.
 * If it is not set, gets the preferred color scheme from the browser.
 * If none of the preferred schemes is supported, gets the first supported scheme.
 * @returns The currently set or the preferred color scheme.
 */
export function getColorSchemeConfiguredOrPreferred(): Scheme {
  return getColorSchemeConfigured() ?? getColorSchemePreferredOrDefault();
}
