/**
 * Get a pseudo-random integer: 0 <= result < maximum
 * @param maximum upper bound (excluded)
 */
export function getPseudoRandomInteger(maximum: number): number {
  return Math.floor(Math.random() * maximum);
}

/**
 * Get pseudo-random integers: 0 <= results[i] < maximums[i]
 * @param maximums upper bounds (excluded)
 */
export function getPseudoRandomIntegers(maximums: number[]): number[] {
  return maximums.map((n: number): number => getPseudoRandomInteger(n));
}

/**
 * Get pseudo-random bytes: 0 <= results < 256
 * @param count number of bytes to be generated
 */
export function getRandomBytes(count: number): number[] {
  return getPseudoRandomIntegers(Array(count).fill(256));
}

/**
 * Get pseudo-random string of the specified characters.
 * @param charsCount number of characters to be returned
 * @param alphabet the characters to select uniformly from
 */
export function getPseudoRandomString(
  charsCount: number = 32,
  alphabet: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
): string {
  let result = "";
  const alphabetLength = alphabet.length;
  for (let i = 0; i < charsCount; i++) {
    result += alphabet.charAt(Math.floor(Math.random() * alphabetLength));
  }
  return result;
}

/**
 * Get a pseudo-random item from the first array that is not in the second array.
 * @param array One of these items will be randomly selected.
 * @param notTheseItems None of these items will be selected.
 * @returns A random item form the first array and not from the second array.
 */
export function getPseudoRandomItem<T>(array: T[], notTheseItems: T[] = []): T {
  const allowedItems = array.filter((x) => !notTheseItems.includes(x));
  if (allowedItems.length === 0) throw new Error("No allowed item.");
  return allowedItems[getPseudoRandomInteger(allowedItems.length)];
}
