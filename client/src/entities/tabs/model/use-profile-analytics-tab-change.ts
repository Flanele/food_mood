import { parseAsString, useQueryState } from "nuqs";
import { AnalyticsTab } from "./use-profile-analytics-tabs";

export const useProfileAnalyticsTabChange = (
  setAnalyticsTab: (t: AnalyticsTab) => void
) => {
  const [, setGroupByRaw] = useQueryState(
    "groupBy",
    parseAsString.withDefault("last-24h")
  );
  const [, setIngredientPeriodRaw] = useQueryState(
    "ingredientPeriod",
    parseAsString.withDefault("all-time")
  );

  const [, setFrom] = useQueryState("from", parseAsString);
  const [, setTo] = useQueryState("to", parseAsString);

  const clearRange = () => {
    setFrom(null);
    setTo(null);
  };

  const onChangeAnalyticsTab = (next: AnalyticsTab) => {
    setAnalyticsTab(next);

    clearRange();

    // сбрасываем режимы неактивных вкладок,
    // чтобы 'custom-period' не висел и не влиял на isCustom
    if (next !== "by-time") {
      setGroupByRaw("last-24h");
    }

    if (next !== "by-ingredients") {
      setIngredientPeriodRaw("all-time");
    }
  };

  return { onChangeAnalyticsTab };
};
