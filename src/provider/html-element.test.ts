import { test, expect } from "vitest";
import * as htmlElement from "./html-element";

function testGettingSelector(
  selector: htmlElement.HtmlElementSelector,
  expectedResult: HTMLElement,
) {
  const selectedElement = htmlElement.getElementBySelector(selector);
  expect(selectedElement).to.be.equal(expectedResult);
}

test("HTML element selector", async () => {
  expect(htmlElement).to.be.ok;
  expect(document.body.children.length).to.be.equal(0);

  const mainAppDivElement = document.createElement("div");
  mainAppDivElement.className = "app";
  mainAppDivElement.id = "main";
  document.body.appendChild(mainAppDivElement);
  expect(document.body.children.length).to.be.equal(1);

  const secondAnotherSpanElement = document.createElement("span");
  secondAnotherSpanElement.className = "another";
  mainAppDivElement.id = "second";
  mainAppDivElement.appendChild(secondAnotherSpanElement);
  expect(document.body.children.length).to.be.equal(1);

  const twinAnotherSpanElement = document.createElement("span");
  twinAnotherSpanElement.className = "another";
  mainAppDivElement.id = "twin";
  mainAppDivElement.appendChild(twinAnotherSpanElement);
  expect(document.body.children.length).to.be.equal(1);

  const elements: HTMLElement[] = [mainAppDivElement, secondAnotherSpanElement];

  function getTestElementById(elementId?: string) {
    const predicate = (e: HTMLElement) =>
      elementId ? e.id === elementId : false;
    return elements.find(predicate);
  }

  function getTestElementByClass(elementClass?: string) {
    const predicate = (e: HTMLElement) =>
      elementClass ? e.classList.contains(elementClass) : false;
    return elements.find(predicate);
  }

  function getTestElementByTag(elementTag?: string) {
    const predicate = (e: HTMLElement) =>
      elementTag ? e.tagName === elementTag : false;
    return elements.find(predicate);
  }

  // empty
  testGettingSelector({}, document.body);
  for (const elementTag of [undefined, ...elements.map((e) => e.tagName)]) {
    if (elementTag) {
      const selector = { elementTag };
      const expectedResult = getTestElementByTag(elementTag) as HTMLElement;
      // contains tag
      testGettingSelector(selector, expectedResult);
    }
    for (const elementClass of [
      undefined,
      ...elements.map((e) => e.className),
    ]) {
      if (elementClass) {
        const selector = { elementClass, elementTag };
        const expectedResult = getTestElementByClass(
          elementClass,
        ) as HTMLElement;
        // contains class
        testGettingSelector(selector, expectedResult);
      }
      for (const elementId of [undefined, ...elements.map((e) => e.id)]) {
        if (elementId) {
          const selector = { elementId, elementClass, elementTag };
          const expectedResult = getTestElementById(elementId) as HTMLElement;
          // contains id
          testGettingSelector(selector, expectedResult);
        }
        for (const element of [document.head, document.body, ...elements]) {
          // contains element
          const selector = { element, elementId, elementClass, elementTag };
          testGettingSelector(selector, element);
        }
      }
    }
  }
});
