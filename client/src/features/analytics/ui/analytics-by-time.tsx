import { getAnalyticsByTimeQuery } from "@/entities/analytics";
import { AnalyticsPeriodForm } from "@/features/forms";
import { getDefaultDayRange } from "@/shared";
import { cn } from "@/shared/lib/utils";
import React from "react";
import {
  AnalyticsMetricTabs,
  AnalyticsTimeTabs,
  useAnalyticsGroupByTimeTabs,
  useAnalyticsMetricTabs,
} from "@/entities/tabs";
import { TimeSeriesLineChart } from "@/entities/charts";
import { ErrorAnimation, SimpleLoader } from "@/shared/ui";

interface Props {
  className?: string;
}

export const AnalyticsByTime: React.FC<Props> = ({ className }) => {
  const { params, groupBy, setGroupBy, from, setFrom, to, setTo, isCustom } =
    useAnalyticsGroupByTimeTabs();

  const { metric, setMetric } = useAnalyticsMetricTabs();

  const { data, isLoading, isError } = getAnalyticsByTimeQuery(params);

  {
    isLoading && (
      <div className="flex flex-col items-center py-10">
        <SimpleLoader className="w-[400px] h-[400px]" />
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="px-6 py-10 flex flex-col items-center gap-4">
        <ErrorAnimation className="w=[400px] h-[400px]" />
        <span>Oops. We encountered an error.</span>
      </div>
    );
  }

  return (
    <div className={cn(className, "flex flex-col gap-6")}>
      {/* controls */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-20">
        {/* period */}
        <div className="flex flex-col gap-2">
          <div className="text-sm font-medium text-muted-foreground">
            Period
          </div>

          <AnalyticsTimeTabs
            value={groupBy}
            onChange={setGroupBy}
            onResetCustomRange={() => {
              setFrom(null);
              setTo(null);
            }}
          />
        </div>

        {/* metric */}
        <div className="flex flex-col gap-2">
          <div className="text-sm font-medium text-muted-foreground">
            Metric
          </div>

          <AnalyticsMetricTabs value={metric} onChange={setMetric} />
        </div>
      </div>

      {/* custom period */}
      {isCustom && (
        <AnalyticsPeriodForm
          defaultValues={{
            from: from ?? getDefaultDayRange().from,
            to: to ?? getDefaultDayRange().to,
          }}
          onApply={(values) => {
            setFrom(values.from);
            setTo(values.to);
          }}
          onClear={() => {
            setFrom(null);
            setTo(null);
          }}
        />
      )}

      {/* chart */}
      <div className="p-4">
        <TimeSeriesLineChart
          data={data?.series ?? []}
          metric={metric}
          yLabel={`Number of ${metric} per period`}
        />
      </div>
    </div>
  );
};
