import { ensureMetaTagContent, getMetaTag } from "./html-meta-tag";

const colorSchemesDefinition = ["dark", "light"];
/**
 * Supported values of color scheme names.
 */
export type Scheme = (typeof colorSchemesDefinition)[number];
/**
 * List of supported color schemes.
 */
export const colorSchemes = Object.freeze(colorSchemesDefinition) as Scheme[];

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
export function getColorScheme(): Scheme | undefined {
  return getMetaTag("color-scheme")?.content;
}

/**
 * Obtains the preferred color scheme from the browser.
 * @returns The preferred scheme.
 */
export function getPreferredColorScheme(): Scheme {
  for (const colorScheme of colorSchemes) {
    if (window.matchMedia(`(prefers-color-scheme: ${colorScheme})`).matches)
      return colorScheme;
  }
  return colorSchemes[0];
}
