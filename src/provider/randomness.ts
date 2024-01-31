/**
 * Get a random item from the first array that is not in the second array.
 * @param array One of these items will be randomly selected.
 * @param notTheseItems None of these items will be selected.
 * @returns A random item form the first array and not from the second array.
 */
export function getRandomItem<T>(array: T[], notTheseItems: T[] = []): T {
  const allowedItems = array.filter((x) => !notTheseItems.includes(x));
  if (allowedItems.length === 0) throw new Error("No allowed item.");
  return allowedItems[Math.floor(Math.random() * allowedItems.length)];
}
