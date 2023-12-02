export function getRandomItem<T>(array: T[], notTheseItems: T[] = []): T {
  const allowedItems = array.filter((x) => !notTheseItems.includes(x));
  if (allowedItems.length === 0) throw new Error("No allowed item.");
  return allowedItems[Math.floor(Math.random() * allowedItems.length)];
}
