/**
 * Get a random integer: 0 <= result < maximum
 * @param maximum upper bound (excluded)
 */
export function getRandomInteger(maximum: number): number {
  return Math.floor(Math.random() * maximum);
}

/**
 * Get random integers: 0 <= results[i] < maximums[i]
 * @param maximums upper bounds (excluded)
 */
export function getRandomIntegers(maximums: number[]): number[] {
  return maximums.map((n: number): number => getRandomInteger(n));
}

/**
 * Get a random item from the first array that is not in the second array.
 * @param array One of these items will be randomly selected.
 * @param notTheseItems None of these items will be selected.
 * @returns A random item form the first array and not from the second array.
 */
export function getRandomItem<T>(array: T[], notTheseItems: T[] = []): T {
  const allowedItems = array.filter((x) => !notTheseItems.includes(x));
  console.log("TODO: Remove me. I'm here just for coverage testing");
  if (allowedItems.length === 0) throw new Error("No allowed item.");
  return allowedItems[getRandomInteger(allowedItems.length)];
}
