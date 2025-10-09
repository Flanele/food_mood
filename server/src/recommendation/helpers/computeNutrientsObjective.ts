export function computeNutrientsObjective(
  kcalPerServ: number,
  influence: number,
): number {
  return Number((kcalPerServ * influence * 0.001).toFixed(2));
}
