import { Diet } from 'src/users/dto';

const MEAT_PRODUCTS = [
  'beef',
  'pork',
  'chicken',
  'turkey',
  'lamb',
  'bacon',
  'ham',
  'gelatin',
];

const FISH_PRODUCTS = ['fish', 'tuna', 'salmon', 'shrimp'];

const ANIMAL_PRODUCTS = [
  'egg',
  'eggs',
  'milk',
  'cheese',
  'butter',
  'yogurt',
  'honey',
  'cream',
];

export const FORBIDDEN_VEGETARIAN = [...MEAT_PRODUCTS, ...FISH_PRODUCTS];

export const FORBIDDEN_VEGAN = [...FORBIDDEN_VEGETARIAN, ...ANIMAL_PRODUCTS];

export const FORBIDDEN_PESCATARIAN = [...MEAT_PRODUCTS];


export function isDietSafe(
  ingredients: { name: string }[],
  diet?: Diet,
): boolean {
  if (!diet) return true;

  const ingredientNames = ingredients.map((i) => i.name.toLowerCase().trim());

  const forbidden =
    diet === Diet.Vegan
      ? FORBIDDEN_VEGAN
      : diet === Diet.Vegetarian
        ? FORBIDDEN_VEGETARIAN
        : diet === Diet.Pescatarian
          ? FORBIDDEN_PESCATARIAN
          : [];

  return !forbidden.some((f) => ingredientNames.includes(f));
}


export function isAllergySafe(
  ingredients: { name: string }[],
  allergies?: string[],
): boolean {
  if (!allergies || allergies.length === 0) return true;

  const ingredientNames = ingredients.map((i) => i.name.toLowerCase().trim());
  return !allergies.some((a) =>
    ingredientNames.includes(a.toLowerCase().trim()),
  );
}


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
