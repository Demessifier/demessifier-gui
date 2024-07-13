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

  function returnFirstOfSelectedElements(
    selectorInfo: string,
    result: HTMLCollectionOf<Element>,
  ) {
    if (result.length > 1) {
      console.warn(
        `Selecting the first of ${result.length} elements of ${selectorInfo}.`,
      );
    }
    return result[0] as HTMLElement;
  }

  if (selector.elementClass) {
    const result = document.getElementsByClassName(selector.elementClass);
    if (result.length > 0) {
      return returnFirstOfSelectedElements(
        `class ${selector.elementClass}`,
        result,
      );
    }
  }
  if (selector.elementTag) {
    const result = document.getElementsByTagName(selector.elementTag);
    if (result.length > 0) {
      return returnFirstOfSelectedElements(
        `tag ${selector.elementTag}`,
        result,
      );
    }
  }
  return document.body;
}

export function sanitizeHref(hrefValue: string): string {
  if (/^javascript:/i.test(hrefValue)) {
    // If the URL starts with 'javascript:', replace it with '#'
    console.error(`Blocked a href value when sanitizing ${hrefValue}`);
    return "#";
  }
  // Otherwise, return the original value
  return hrefValue;
}
