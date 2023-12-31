/**
 * Adds a new meta tag with the given value.
 * @param name The name of the new meta tag.
 * @param content The value of the new meta tag.
 * @returns The new meta tag.
 */
export function addMetaTag(name: string, content: string): HTMLMetaElement {
  const meta: HTMLMetaElement = document.createElement("meta");
  meta.name = name;
  meta.content = content;
  document.head.appendChild(meta);
  return meta;
}

/**
 * Retrieves a meta tag by its name.
 * @param name Name of the meta tag to be retrieved.
 * @returns The retrieved meta tag or null if it doesn't exist.
 */
export function getMetaTag(name: string): HTMLMetaElement | null {
  return document.head.querySelector(`meta[name="${name}"]`);
}

/**
 * Retrieves a meta tag content by the name of the meta tag.
 * @param name Name of the meta tag to retrieve content from.
 * @returns The retrieved meta tag content or undefined.
 */
export function getMetaTagContent(name: string): string | undefined {
  return getMetaTag(name)?.content;
}

/**
 * Makes sure that a meta tag exists.
 * If it exists, the value is ignored.
 * If it doesn't exist, it is created with the given value.
 * @param name Name of the meta tag to be ensured.
 * @param defaultContent The value to be used if the meta tag didn't exist.
 * @returns The edited meta tag.
 */
export function ensureMetaTagExistence(
  name: string,
  defaultContent: string
): HTMLMetaElement {
  return getMetaTag(name) ?? addMetaTag(name, defaultContent);
}

/**
 * Creates a new meta tag if it doesn't exist or sets a value to an existing meta tag.
 * @param name Name of the meta tag to be set.
 * @param newContent Value to be set to the meta tag.
 * @returns The edited meta tag.
 */
export function ensureMetaTagContent(
  name: string,
  newContent: string
): HTMLMetaElement {
  const meta = ensureMetaTagExistence(name, newContent);
  return setMetaTagContent(meta, newContent);
}

/**
 * Sets a value to the given meta tag.
 * @param meta The meta tag to be edited.
 * @param content The new value to be set to the given meta tag.
 * @returns The meta tag.
 */
export function setMetaTagContent(
  meta: HTMLMetaElement,
  content: string
): HTMLMetaElement {
  meta.setAttribute("content", content);
  return meta;
}
