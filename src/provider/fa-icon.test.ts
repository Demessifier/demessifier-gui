import { test, expect } from "vitest";
import { FaIcon, faIconInit, getIconClassName, getIconObject } from "./fa-icon";

test("Font Awesome Icons", async () => {
  expect(faIconInit).to.be.ok;

  const faIconPack = faIconInit();
  expect(faIconPack).to.be.ok;
  expect(Object.keys(faIconPack)).to.have.length.gte(4);
  for (const [key, value] of Object.entries(faIconPack)) {
    expect(key).not.to.be.undefined;
    expect(value).to.be.ok;
    expect(value).to.be.equal(getIconObject(key as FaIcon));
    expect(getIconClassName(key as FaIcon).substring(0, 3)).to.be.equal("fa-");
  }
});
