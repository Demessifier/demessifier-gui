/**
 * Returns all possible pairs from the given array.
 * [1, 2, 3] -> [[1,2], [1,3], [2,3]]
 * @param arr
 */
export function getPairs<T>(arr: T[]): T[][] {
  return arr.map((v, i) => arr.slice(i + 1).map((w) => [v, w])).flat();
}
