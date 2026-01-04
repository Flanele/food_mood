import { parseAsString, useQueryState } from "nuqs";

export type AnalyticsTab = "by-time" | "by-ingredients" | "nutrients-score";

const analyticsTabs: AnalyticsTab[] = [
  "by-time",
  "by-ingredients",
  "nutrients-score",
];

export const useProfileAnalyticsTabs = () => {
  const [analyticsTabRaw, setAnalyticsTabRaw] = useQueryState(
    "analyticsTab",
    parseAsString.withDefault("by-time")
  );

  const analyticsTab: AnalyticsTab = analyticsTabs.includes(
    analyticsTabRaw as AnalyticsTab
  )
    ? (analyticsTabRaw as AnalyticsTab)
    : "by-time";

  const setAnalyticsTab = (t: AnalyticsTab) => setAnalyticsTabRaw(t);

  return { analyticsTab, setAnalyticsTab };
};
