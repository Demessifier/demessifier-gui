import { test, expect } from "vitest";
import { getPairs } from "./combinations";

test("getPairs", async () => {
  expect(getPairs).to.be.ok;
  const result123 = getPairs([0, 1, 2]);
  expect(result123).to.have.length(3);
  const counts = [0, 0, 0];
  for (const pair of result123) {
    expect(pair).to.have.length(2);
    counts[pair[0]]++;
    counts[pair[1]]++;
  }
  for (const count of counts) {
    expect(count).to.be.equal(2);
  }
});
