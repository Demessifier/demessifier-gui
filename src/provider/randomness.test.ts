import { test, expect } from "vitest";
import {
  getRandomInteger,
  getRandomIntegers,
  getRandomItem,
} from "./randomness";

test("Randomness tools: getRandomItem", async () => {
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

test("Randomness tools: getRandomInteger", async () => {
  const bot = 1;
  const top = 1000;
  for (let _ = 0; _ < 30; _++) {
    const randomMaximum = getRandomInteger(top) + bot;
    expect(randomMaximum).to.be.greaterThanOrEqual(bot);
    expect(randomMaximum).to.be.lessThan(top + bot);
    expect(randomMaximum % 1).to.be.equal(0);

    const randomValue = getRandomInteger(randomMaximum);
    expect(randomValue).to.be.greaterThanOrEqual(0);
    expect(randomValue).to.be.lessThan(randomMaximum);
    expect(randomValue % 1).to.be.equal(0);
  }
});

test("Randomness tools: getRandomIntegers", async () => {
  const LENGTH = 30;
  const bot = 1;
  const top = 1000;
  const randomMaximums = [];
  for (let _ = 0; _ < LENGTH; _++) {
    randomMaximums.push(getRandomInteger(top) + bot);
  }
  const randomValues = getRandomIntegers(randomMaximums);
  expect(randomMaximums).to.have.length(LENGTH);
  expect(randomValues).to.have.length(LENGTH);
  for (let i = 0; i < LENGTH; i++) {
    const randomValue = randomValues[i];
    const randomMaximum = randomMaximums[i];
    expect(randomValue).to.be.greaterThanOrEqual(0);
    expect(randomValue).to.be.lessThan(randomMaximum);
    expect(randomValue % 1).to.be.equal(0);
  }
});
