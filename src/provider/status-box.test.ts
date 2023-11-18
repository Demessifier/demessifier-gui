import { test, expect } from "vitest";
import { statusBoxIcons, statusBoxType } from "./status-box";
import { faIconInit } from "./fa-icon";

test("Status Box Icons", async () => {
  const allIcons = Object.keys(faIconInit());
  const NUMBER_OF_STATES = 4;

  expect(statusBoxIcons).toBeTruthy();
  const statusBoxIconsKeys = Object.keys(statusBoxIcons);
  expect(statusBoxIconsKeys).toHaveLength(NUMBER_OF_STATES);
  for (const [key, value] of Object.entries(statusBoxIcons)) {
    expect(allIcons).toContain(value);
  }
  const iconsNamesList = statusBoxIconsKeys;

  expect(statusBoxType).toBeTruthy();
  expect(Object.keys(statusBoxType)).toHaveLength(NUMBER_OF_STATES);
  for (const [key, value] of Object.entries(statusBoxType)) {
    expect(iconsNamesList).toContain(key);
    expect(value).toBeTruthy();
    expect(Object.keys(value)).toHaveLength(1);
    expect(allIcons).toContain(value.icon);
  }
});
