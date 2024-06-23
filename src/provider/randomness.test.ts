import { test, expect } from "vitest";
import {
  getRandomBase64String,
  getRandomBytes,
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

test("Randomness tools: getRandomBytes", async () => {
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

test("Randomness tools: getRandomBase64String", async () => {
  const validB64Chars = [
    ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    ..."abcdefghijklmnopqrstuvwxyz",
    ..."0123456789",
    ..."+/",
  ];
  for (const bytesLength3 of [0, 3, 30, 9, 99]) {
    const stringLength4 = (bytesLength3 / 3) * 4;
    for (let offset = 0; offset < 3; offset++) {
      const bytesLength = bytesLength3 + offset;
      const equalSigns = (3 - offset) % 3;
      const stringLength = stringLength4 + (offset == 0 ? 0 : 4);

      const randomString = getRandomBase64String(bytesLength);
      expect(randomString).to.have.length(stringLength);
      const characters = [...randomString];
      characters.forEach((c, i) => {
        if (i < stringLength - equalSigns) {
          expect(validB64Chars).to.include(c);
        } else {
          expect(c).to.be.equal("=");
        }
      });
    }
  }
});
