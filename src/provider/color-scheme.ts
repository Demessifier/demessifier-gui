import { ensureMetaTagContent, getMetaTag } from "./html-meta-tag";

const colorSchemesDefinition = ["dark", "light"];
export type Scheme = (typeof colorSchemesDefinition)[number];
export const colorSchemes = Object.freeze(colorSchemesDefinition) as Scheme[];

export function setColorScheme(scheme: Scheme) {
  ensureMetaTagContent("color-scheme", scheme);
}

export function getColorScheme(): Scheme | undefined {
  return getMetaTag("color-scheme")?.content;
}

export function getPreferredColorScheme(): Scheme {
  for (const colorScheme of colorSchemes) {
    if (window.matchMedia(`(prefers-color-scheme: ${colorScheme})`).matches)
      return colorScheme;
  }
  return colorSchemes[0];
}
