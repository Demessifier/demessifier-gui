import { test, expect } from "vitest";
import { FaIcon, faIconInit, getIconObject } from "./fa-icon";

test("Font Awesome Icons", async () => {
  expect(faIconInit).toBeTruthy();

  const faIconPack = faIconInit();
  expect(faIconPack).toBeTruthy();
  expect(Object.keys(faIconPack).length).toBeGreaterThanOrEqual(4);
  for (const [key, value] of Object.entries(faIconPack)) {
    expect(key).toBeTruthy();
    expect(value).toBeTruthy();
    expect(value).toBe(getIconObject(key as FaIcon));
  }
});
