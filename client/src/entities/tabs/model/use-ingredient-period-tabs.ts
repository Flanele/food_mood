import { parseAsString, useQueryState } from "nuqs";
import { useDateRange } from "./use-date-range";

export type IngredientPeriodTab = "all-time" | "custom-period";

const periodTabs: IngredientPeriodTab[] = ["all-time", "custom-period"];

export const useIngredientPeriodTabs = () => {
  const [periodRaw, setPeriodRaw] = useQueryState(
    "ingredientPeriod",
    parseAsString.withDefault("all-time")
  );

  const period: IngredientPeriodTab = periodTabs.includes(
    periodRaw as IngredientPeriodTab
  )
    ? (periodRaw as IngredientPeriodTab)
    : "all-time";

  const { from, setFrom, to, setTo, clearRange } = useDateRange();

  const setPeriod = (p: IngredientPeriodTab) => {
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
