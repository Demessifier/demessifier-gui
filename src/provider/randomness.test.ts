import { test, expect } from "vitest";
import { getRandomItem } from "./randomness";

test("Randomness tools", async () => {
  const bigger = ["cheese", "vegetables", "apple", "water", "carrot"];
  const smaller = ["apple", "carrot"];
  const overlap = ["vegetables", "brick", "mug"];
  const different = ["brick", "mug"];

  for (
    let _i = 0;
    _i < bigger.length + smaller.length + overlap.length + different.length;
    _i++
  ) {
    for (const array of [bigger, smaller, overlap, different]) {
      expect(array).to.contain(getRandomItem(array));
    }
    for (const subtractedArray of [smaller, overlap, different]) {
      const randomItem = getRandomItem(bigger, subtractedArray);
      expect(bigger).to.contain(randomItem);
      expect(subtractedArray).not.to.contain(randomItem);
    }
  }
  expect(() => getRandomItem(smaller, bigger)).to.throw("No allowed item.");
  for (const array of [bigger, smaller, overlap, different]) {
    expect(() => getRandomItem(array, array)).to.throw("No allowed item.");
  }
});
