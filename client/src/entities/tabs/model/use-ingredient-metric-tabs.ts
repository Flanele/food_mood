import { IngredientMetric } from "@/shared";
import { parseAsString, useQueryState } from "nuqs";

const ingredientMetricTabs: IngredientMetric[] = [
  "count",
  "totalGrams",
  "totalKcal",
];

export const useIngredientMetricTabs = () => {
  const [metricRaw, setMetricRaw] = useQueryState(
    "ingredientMetric",
    parseAsString.withDefault("count")
  );

  const metric: IngredientMetric = ingredientMetricTabs.includes(
    metricRaw as IngredientMetric
  )
    ? (metricRaw as IngredientMetric)
    : "count";

  const setMetric = (m: IngredientMetric) => setMetricRaw(m);

  return { metric, setMetric };
};
