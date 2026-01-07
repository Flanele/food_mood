import { useGetNutrientsScoreQuery } from "@/entities/analytics";
import {
  NutrientsScoreBarChart,
  NutrientsScoreLineChart,
} from "@/entities/charts";
import {
  AnalyticsMetricTabs,
  PeriodTabs,
  useAnalyticsMetricTabs,
  useNutrientScorePeriodTabs,
} from "@/entities/tabs";
import { AnalyticsPeriodForm } from "@/features/forms";
import { getDefaultDayRange } from "@/shared";
import { AnalyticsControllerGetScoreCorrelationByMetricParams } from "@/shared/api/gen";
import { cn } from "@/shared/lib/utils";
import { ErrorAnimation, SimpleLoader } from "@/shared/ui";
import React from "react";

interface Props {
  className?: string;
}

export const AnalyticsNutrientsScore: React.FC<Props> = ({ className }) => {
  const { metric, setMetric } = useAnalyticsMetricTabs();

  const { from, to, setFrom, setTo, isCustom, clearRange, period, setPeriod } =
    useNutrientScorePeriodTabs();

  const params: AnalyticsControllerGetScoreCorrelationByMetricParams = {
    metric,
    from: from ?? undefined,
    to: to ?? undefined,
  };

  const { data, isLoading, isError } = useGetNutrientsScoreQuery(params);

  if (isLoading) {
    return (
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

  const correlationData = data
    ? [
        { name: "Mood", value: data.correlation.mood ?? 0 },
        { name: "Energy", value: data.correlation.energy ?? 0 },
        { name: "Sleep", value: data.correlation.sleep ?? 0 },
      ]
    : [];

  return (
    <div className={cn(className, "flex flex-col gap-6")}>
      {/* controls */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-20">
        {/* period */}
        <div className="flex flex-col gap-2">
          <div className="text-sm font-medium text-muted-foreground">
            Period
          </div>

          <PeriodTabs value={period} onChange={setPeriod} />
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
            clearRange();
          }}
        />
      )}

      {/* total consumed */}
      <div className="rounded-md border border-border bg-card p-4">
        <div className="text-sm text-muted-foreground">Total consumed</div>
        <div className="mt-1 text-2xl font-semibold">
          {(data?.totalConsumed ?? 0).toFixed(2)}{" "}
          <span className="text-sm font-normal text-muted-foreground">
            {metric}
          </span>
        </div>
        <div className="mt-1 text-sm text-muted-foreground">
          Sum of the selected nutrient for the chosen period.
        </div>
      </div>

      {/* correlation */}
      <div className="p-4">
        <div className="text-base font-medium">Correlation score</div>
        <div className="mt-1 text-sm text-muted-foreground">
          Shows how the selected nutrient relates to your daily scores. Range is{" "}
          <span className="font-medium">-1 to 1</span>: negative means worse
          association, positive means better association, and 0 means no clear
          relationship.
        </div>

        <div className="mt-4">
          <NutrientsScoreBarChart data={correlationData} />
        </div>
      </div>

      {/* daily wellbeing over time */}
      <div className="p-4">
        <div className="text-base font-medium">Daily well-being scores</div>
        <div className="mt-1 text-sm text-muted-foreground">
          Your mood, energy, and sleep scores recorded over time for the
          selected period.
        </div>

        <div className="mt-4">
          <NutrientsScoreLineChart data={data?.details ?? []} />
        </div>
      </div>
    </div>
  );
};
