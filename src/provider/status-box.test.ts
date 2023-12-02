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

  expect(getAllStatusBoxFlavors).to.be.ok;
  const statusBoxFlavors = getAllStatusBoxFlavors();
  expect(statusBoxFlavors).to.have.length(NUMBER_OF_STATES);
  for (const flavor of statusBoxFlavors) {
    expect(allIcons).to.contain(getFlavorItem(flavor).icon);
  }
  const iconsNamesList = statusBoxFlavors;

  expect(statusBoxFlavor).to.be.ok;
  expect(Object.keys(statusBoxFlavor)).to.have.length(NUMBER_OF_STATES);
  for (const [key, value] of Object.entries(statusBoxFlavor)) {
    expect(iconsNamesList).to.contain(key);
    expect(value).to.be.ok;
    expect(Object.keys(value)).to.have.length(1);
    expect(allIcons).to.contain(value.icon);
  }
});
