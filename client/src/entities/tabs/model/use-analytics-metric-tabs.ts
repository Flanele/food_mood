import { Metric } from "@/shared";
import { parseAsString, useQueryState } from "nuqs";

const metricTabs: Metric[] = ["kcal", "prot", "fat", "carb", "sugar"];

export const useAnalyticsMetricTabs = () => {
  const [metricRaw, setMetricRaw] = useQueryState(
    "metric",
    parseAsString.withDefault("kcal")
  );

  const metric: Metric = metricTabs.includes(metricRaw as Metric)
    ? (metricRaw as Metric)
    : "kcal";

  const setMetric = (m: Metric) => setMetricRaw(m);

  return { metric, setMetric };
};

