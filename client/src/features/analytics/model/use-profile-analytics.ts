import { parseAsString, useQueryState } from "nuqs";

type AnalyticsTab = "by-time" | "by-ingredients" | "nutrients-score";
const analyticsTabs: AnalyticsTab[] = [
  "by-time",
  "by-ingredients",
  "nutrients-score",
];

export const useProfileAnalytics = () => {
  const [analyticsTab, setAnalyticsTab] = useQueryState(
    "analyticsTab",
    parseAsString.withDefault("by-time")
  );

  const safeAnalyticsTab = analyticsTabs.includes(analyticsTab as AnalyticsTab)
    ? (analyticsTab as AnalyticsTab)
    : "by-time";

  return {
    analyticsTab,
    safeAnalyticsTab,
    setAnalyticsTab,
  };
};
