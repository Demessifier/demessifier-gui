import { test, expect } from "vitest";
import {
  getPseudoRandomString,
  getRandomBytes,
  getPseudoRandomInteger,
  getPseudoRandomIntegers,
  getPseudoRandomItem,
} from "./randomness";

test("Randomness tools: getPseudoRandomItem", async () => {
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
      expect(array).to.contain(getPseudoRandomItem(array));
    }
    for (const subtractedArray of [smaller, overlap, different]) {
      const randomItem = getPseudoRandomItem(bigger, subtractedArray);
      expect(bigger).to.contain(randomItem);
      expect(subtractedArray).not.to.contain(randomItem);
    }
  }
  expect(() => getPseudoRandomItem(smaller, bigger)).to.throw(
    "No allowed item.",
  );
  for (const array of [bigger, smaller, overlap, different]) {
    expect(() => getPseudoRandomItem(array, array)).to.throw(
      "No allowed item.",
    );
  }
});

test("Randomness tools: getPseudoRandomInteger", async () => {
  const bot = 1;
  const top = 1000;
  for (let _ = 0; _ < 30; _++) {
    const randomMaximum = getPseudoRandomInteger(top) + bot;
    expect(randomMaximum).to.be.greaterThanOrEqual(bot);
    expect(randomMaximum).to.be.lessThan(top + bot);
    expect(randomMaximum % 1).to.be.equal(0);

    const randomValue = getPseudoRandomInteger(randomMaximum);
    expect(randomValue).to.be.greaterThanOrEqual(0);
    expect(randomValue).to.be.lessThan(randomMaximum);
    expect(randomValue % 1).to.be.equal(0);
  }
});

test("Randomness tools: getPseudoRandomIntegers", async () => {
  const LENGTH = 30;
  const bot = 1;
  const top = 1000;
  const randomMaximums = [];
  for (let _ = 0; _ < LENGTH; _++) {
    randomMaximums.push(getPseudoRandomInteger(top) + bot);
  }
  const randomValues = getPseudoRandomIntegers(randomMaximums);
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

test("Randomness tools: getPseudoRandomBytes", async () => {
  for (const length of [0, 30, 64]) {
    const randomValues = getRandomBytes(length);
    expect(randomValues).to.have.length(length);
    for (let i = 0; i < length; i++) {
      const randomValue = randomValues[i];
      expect(randomValue).to.be.greaterThanOrEqual(0);
      expect(randomValue).to.be.lessThan(256);
      expect(randomValue % 1).to.be.equal(0);
    }
  }
});

test("Randomness tools: getPseudoRandomString", async () => {
  for (const charsLength of [0, 3, 8, 99]) {
    const alphabetLength = 20;
    const alphabet = getPseudoRandomString(alphabetLength);
    expect(alphabet).to.have.length(alphabetLength);

    const randomString = getPseudoRandomString(charsLength, alphabet);
    expect(randomString).to.have.length(charsLength);
    for (const c of randomString) {
      expect(alphabet).to.contain(c);
    }
  }
});
