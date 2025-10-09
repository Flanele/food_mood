export function calculateIngredientSimilarity(
  listA: string[],
  listB: string[],
): number {
  const setA = new Set(listA.map((item) => item.toLowerCase().trim()));
  const setB = new Set(listB.map((item) => item.toLowerCase().trim()));

  const intersectionCount = [...setA].filter((item) => setB.has(item)).length;
  const unionCount = new Set([...setA, ...setB]).size || 1;

  return intersectionCount / unionCount;
}
