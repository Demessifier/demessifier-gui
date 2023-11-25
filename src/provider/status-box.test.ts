import { test, expect } from "vitest";
import {
  getAllStatusBoxFlavors,
  getFlavorItem,
  statusBoxFlavor,
} from "./status-box";
import { faIconInit } from "./fa-icon";

test("Status Box Icons", async () => {
  const allIcons = Object.keys(faIconInit());
  const NUMBER_OF_STATES = 4;

  expect(getAllStatusBoxFlavors).toBeTruthy();
  const statusBoxFlavors = getAllStatusBoxFlavors();
  expect(statusBoxFlavors).toHaveLength(NUMBER_OF_STATES);
  for (const flavor of statusBoxFlavors) {
    expect(allIcons).toContain(getFlavorItem(flavor).icon);
  }
  const iconsNamesList = statusBoxFlavors;

  expect(statusBoxFlavor).toBeTruthy();
  expect(Object.keys(statusBoxFlavor)).toHaveLength(NUMBER_OF_STATES);
  for (const [key, value] of Object.entries(statusBoxFlavor)) {
    expect(iconsNamesList).toContain(key);
    expect(value).toBeTruthy();
    expect(Object.keys(value)).toHaveLength(1);
    expect(allIcons).toContain(value.icon);
  }
});
