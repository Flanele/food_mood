import { IngredientMetric, Orientation } from "@/shared";
import { cn } from "@/shared/lib/utils";
import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type Point = {
  name: string;
  count: number;
  totalGrams: number;
  totalKcal: number;
};

interface Props {
  className?: string;
  metric: IngredientMetric;
  yLabel?: string;
  data: Point[];
  orientation?: Orientation;
}

export const IngredientBarChart: React.FC<Props> = ({
  className,
  metric,
  yLabel,
  data,
  orientation = "vertical",
}) => {
  const PRIMARY = "#00C950";
  const SECONDARY = "#F5F6FA";
  const isEmpty = !data || data.length === 0;
  const isHorizontal = orientation === "horizontal";

  const chartData = React.useMemo<Point[]>(() => {
    if (!isEmpty) return data;
    return [{ name: "—", count: 0, totalGrams: 0, totalKcal: 0 }];
  }, [data, isEmpty]);

  return (
    <div className={cn(className)}>
      <div className="relative h-[440px] w-full">
        <ResponsiveContainer>
          <BarChart
            data={chartData}
            layout={isHorizontal ? "vertical" : "horizontal"}
            margin={{ top: 8, right: 16, bottom: 8, left: 16 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip cursor={{ fill: SECONDARY }} />

            {isHorizontal ? (
              <>
                <XAxis type="number" />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={120}
                  interval={0}
                />
              </>
            ) : (
              <>
                <XAxis dataKey="name" />
                <YAxis type="number" interval={0} />
              </>
            )}

            <Bar
              dataKey={metric}
              fill={PRIMARY}
              stroke={PRIMARY}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>

        {isEmpty && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="rounded-md bg-white/90 px-3 py-2 text-sm text-gray-500 shadow">
              No data for selected period
            </div>
          </div>
        )}
      </div>

      {yLabel && (
        <div className="mt-2 text-sm text-muted-foreground">{yLabel}</div>
      )}
    </div>
  );
};
