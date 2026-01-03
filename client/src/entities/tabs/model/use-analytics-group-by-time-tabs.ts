import { AnalyticsControllerGetAnalyticsByTimeParams } from "@/shared/api/gen";
import { parseAsString, useQueryState } from "nuqs";

export type GroupByTab = "last-24h" | "last-7d" | "last-30d" | "custom-period";
const groupByTabs: GroupByTab[] = [
  "last-24h",
  "last-7d",
  "last-30d",
  "custom-period",
];

type TimeGrouping = "day" | "week" | "month";

const tabToDtoGroupBy: Record<
  Exclude<GroupByTab, "custom-period">,
  TimeGrouping
> = {
  "last-24h": "day",
  "last-7d": "week",
  "last-30d": "month",
};

export const useAnalyticsGroupByTimeTabs = () => {
  const [groupByRaw, setGroupByRaw] = useQueryState(
    "groupBy",
    parseAsString.withDefault("last-24h")
  );

  const groupBy: GroupByTab = groupByTabs.includes(groupByRaw as GroupByTab)
    ? (groupByRaw as GroupByTab)
    : "last-24h";

  const isCustom = groupBy === "custom-period";

  const [from, setFrom] = useQueryState("from", parseAsString);
  const [to, setTo] = useQueryState("to", parseAsString);

  const setGroupBy = (tab: GroupByTab) => setGroupByRaw(tab);

  const params: AnalyticsControllerGetAnalyticsByTimeParams = isCustom
    ? {
        from: from ?? undefined,
        to: to ?? undefined,
      }
    : {
        groupBy: tabToDtoGroupBy[groupBy],
      };

  return {
    groupBy,
    setGroupBy,
    isCustom,
    from,
    setFrom,
    to,
    setTo,
    params,
  };
};
