export type HtmlElementSelector = {
  element?: HTMLElement;
  elementId?: string;
  elementClass?: string;
  elementTag?: string;
};

export function getElementBySelector(
  selector: HtmlElementSelector,
): HTMLElement {
  if (selector.element) return selector.element;
  if (selector.elementId) {
    const result = document.getElementById(selector.elementId);
    if (result) return result;
  }
  if (selector.elementClass) {
    const result = document.getElementsByClassName(selector.elementClass);
    if (result.length > 0) {
      if (result.length > 1) {
        console.warn(
          `Selecting the first of ${result.length} elements of class ${selector.elementClass}.`,
        );
      }
      return result[0] as HTMLElement;
    }
  }
  if (selector.elementTag) {
    const result = document.getElementsByTagName(selector.elementTag);
    if (result.length > 0) {
      if (result.length > 1) {
        console.warn(
          `Selecting the first of ${result.length} elements of tag ${selector.elementTag}.`,
        );
      }
      return result[0] as HTMLElement;
    }
  }
  return document.body;
}
