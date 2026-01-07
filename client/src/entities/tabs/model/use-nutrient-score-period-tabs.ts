import { parseAsString, useQueryState } from "nuqs";
import { useDateRange } from "./use-date-range";

export type NutrientScorePeriodTab = "all-time" | "custom-period";

const periodTabs: NutrientScorePeriodTab[] = ["all-time", "custom-period"];

export const useNutrientScorePeriodTabs = () => {
  const [periodRaw, setPeriodRaw] = useQueryState(
    "nutrientScorePeriod",
    parseAsString.withDefault("all-time")
  );

  const period: NutrientScorePeriodTab = periodTabs.includes(
    periodRaw as NutrientScorePeriodTab
  )
    ? (periodRaw as NutrientScorePeriodTab)
    : "all-time";

  const { from, setFrom, to, setTo, clearRange } = useDateRange();

  const setPeriod = (p: NutrientScorePeriodTab) => {
    setPeriodRaw(p);
    if (p === "all-time") clearRange();
  };

  const isCustom = period === "custom-period";

  return {
    period,
    setPeriod,
    isCustom,
    from,
    setFrom,
    to,
    setTo,
    clearRange,
  };
};
