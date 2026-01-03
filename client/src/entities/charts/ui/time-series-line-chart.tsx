import { cn } from "@/shared/lib/utils";
import React from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Metric = "kcal" | "prot" | "fat" | "carb" | "sugar";

type Point = {
  key: string;
} & Partial<Record<Metric, number>>;

interface Props {
  className?: string;
  metric: Metric;
  yLabel?: string;
  data: Point[];
}

export const TimeSeriesLineChart: React.FC<Props> = ({
  className,
  metric,
  yLabel,
  data,
}) => {
  const PRIMARY = "#00C950"; // oklch(0.723 0.219 149.579) ≈ sRGB

  const isEmpty = !data || data.length === 0;

  return (
    <div className={cn(className)}>
      <div className="relative h-80 w-full">
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="key" tick={{ fill: "#6B7280", fontSize: 12 }} />
            <YAxis tick={{ fill: "#6B7280", fontSize: 12 }} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey={metric}
              stroke={PRIMARY}
              strokeWidth={2}
              dot={{ r: 3, fill: PRIMARY, stroke: PRIMARY, strokeWidth: 1 }}
              activeDot={{ r: 5, fill: PRIMARY, stroke: PRIMARY }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>

        {/* Empty state overlay */}
        {isEmpty && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="rounded-md border bg-white/90 px-3 py-2 text-sm text-gray-500 shadow">
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
