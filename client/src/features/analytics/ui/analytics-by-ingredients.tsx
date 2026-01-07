import { useGetTopIngredientsQuery } from "@/entities/analytics";
import { IngredientBarChart } from "@/entities/charts";
import {
  IngredientMetricTabs,
  PeriodTabs,
  IngredientTopTabs,
  useIngredientMetricTabs,
  useIngredientPeriodTabs,
  useIngredientTopTabs,
} from "@/entities/tabs";
import { AnalyticsPeriodForm } from "@/features/forms";
import { getDefaultDayRange } from "@/shared";
import { cn } from "@/shared/lib/utils";
import { ErrorAnimation, SimpleLoader } from "@/shared/ui";
import React from "react";

interface Props {
  className?: string;
}

export const AnalyticsByIngredients: React.FC<Props> = ({ className }) => {
  const { period, setPeriod, from, setFrom, to, setTo, clearRange, isCustom } =
    useIngredientPeriodTabs();
  const { metric, setMetric } = useIngredientMetricTabs();
  const { top, setTop, limit, orientation } = useIngredientTopTabs();

  const params = {
    ...(isCustom && from ? { from } : {}),
    ...(isCustom && to ? { to } : {}),
    limit,
  };

  const { data, isLoading, isError } = useGetTopIngredientsQuery(params);

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

  return (
    <div className={cn(className, "flex flex-col gap-4")}>
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

          <IngredientMetricTabs value={metric} onChange={setMetric} />
        </div>

        {/* top */}
        <div className="flex flex-col gap-2">
          <div className="text-sm font-medium text-muted-foreground">Top</div>

          <IngredientTopTabs value={top} onChange={setTop} />
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

      {/* chart */}
      <div className="p-2">
        <IngredientBarChart
          data={data?.items ?? []}
          metric={metric}
          orientation={orientation}
          yLabel={`Top ingredients by ${metric}`}
        />
      </div>
    </div>
  );
};
