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
 * Get random bytes: 0 <= results < 256
 * @param count number of bytes to be generated
 */
export function getRandomBytes(count: number): number[] {
  return getRandomIntegers(Array(count).fill(256));
}

/**
 * Get random Base64 string of length 4/3 of bytesCount (3 bytes ~ 4 characters).
 * @param bytesCount number of bytes to be generated. Use multiples of 3 to avoid the tailing '=' signs
 */
export function getRandomBase64String(bytesCount: number): string {
  return btoa(String.fromCharCode(...getRandomBytes(bytesCount)));
}

/**
 * Get a random item from the first array that is not in the second array.
 * @param array One of these items will be randomly selected.
 * @param notTheseItems None of these items will be selected.
 * @returns A random item form the first array and not from the second array.
 */
export function getRandomItem<T>(array: T[], notTheseItems: T[] = []): T {
  const allowedItems = array.filter((x) => !notTheseItems.includes(x));
  if (allowedItems.length === 0) throw new Error("No allowed item.");
  return allowedItems[getRandomInteger(allowedItems.length)];
}
