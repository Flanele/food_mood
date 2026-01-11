import { parseAsString, useQueryState } from "nuqs";

export type ObjectiveTab = "balanced" | "mood" | "energy" | "sleep";

export const useRecommendationObjectiveTabs = () => {
  const objectiveTabs: ObjectiveTab[] = ["balanced", "mood", "energy", "sleep"];

  const [tabRaw, setTabRaw] = useQueryState(
    "objective",
    parseAsString.withDefault("balanced")
  );

  const tab: ObjectiveTab = objectiveTabs.includes(tabRaw as ObjectiveTab)
    ? (tabRaw as ObjectiveTab)
    : "balanced";

  const setTab = (t: ObjectiveTab) => setTabRaw(t);

  return { tab, setTab };
};
