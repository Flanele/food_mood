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

export type Point = {
  date: string;
  metricValue: number;
  mood: number | null;
  energy: number | null;
  sleep: number | null;
};

interface Props {
  className?: string;
  yLabel?: string;
  data: Point[];
}

export const NutrientsScoreLineChart: React.FC<Props> = ({
  className,
  yLabel,
  data,
}) => {
  const isEmpty = !data || data.length === 0;
  const PRIMARY = "#00C950";

  const n = data?.length ?? 0;

  // keep X labels readable
  const rotateTicks = n > 10;
  const xInterval = n > 40 ? Math.ceil(n / 8) : "preserveStartEnd";

  // reduce visual noise when many points
  const showDots = n <= 60;
  const dotR = n > 30 ? 2 : 3;
  const activeDotR = n > 30 ? 4 : 5;

  return (
    <div className={cn(className)}>
      <div className="relative h-[430px] w-full">
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />

            <XAxis
              dataKey="date"
              tick={{ fill: "#6B7280", fontSize: 12 }}
              interval={xInterval as any}
              angle={rotateTicks ? -35 : 0}
              textAnchor={rotateTicks ? "end" : "middle"}
              height={rotateTicks ? 60 : 30}
            />

            <YAxis tick={{ fill: "#6B7280", fontSize: 12 }} />
            <Tooltip />

            <Line
              type="monotone"
              dataKey="mood"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={
                showDots
                  ? {
                      r: dotR,
                      fill: "#3B82F6",
                      stroke: "#3B82F6",
                      strokeWidth: 1,
                    }
                  : false
              }
              activeDot={{
                r: activeDotR,
                fill: "#3B82F6",
                stroke: "#3B82F6",
              }}
              isAnimationActive={false}
            />

            <Line
              type="monotone"
              dataKey="energy"
              stroke={PRIMARY}
              strokeWidth={2}
              dot={
                showDots
                  ? { r: dotR, fill: PRIMARY, stroke: PRIMARY, strokeWidth: 1 }
                  : false
              }
              activeDot={{ r: activeDotR, fill: PRIMARY, stroke: PRIMARY }}
              isAnimationActive={false}
            />

            <Line
              type="monotone"
              dataKey="sleep"
              stroke="#8B5CF6"
              strokeWidth={2}
              dot={
                showDots
                  ? {
                      r: dotR,
                      fill: "#8B5CF6",
                      stroke: "#8B5CF6",
                      strokeWidth: 1,
                    }
                  : false
              }
              activeDot={{
                r: activeDotR,
                fill: "#8B5CF6",
                stroke: "#8B5CF6",
              }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>

        {isEmpty && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="rounded-md border bg-white/90 px-3 py-2 text-sm text-gray-500 shadow">
              No data for selected period
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span
            className="h-3 w-3 rounded-sm"
            style={{ backgroundColor: "#3B82F6" }}
          />
          <span>Mood</span>
        </div>

        <div className="flex items-center gap-2">
          <span
            className="h-3 w-3 rounded-sm"
            style={{ backgroundColor: PRIMARY }}
          />
          <span>Energy</span>
        </div>

        <div className="flex items-center gap-2">
          <span
            className="h-3 w-3 rounded-sm"
            style={{ backgroundColor: "#8B5CF6" }}
          />
          <span>Sleep</span>
        </div>
      </div>

      {yLabel && (
        <div className="mt-2 text-sm text-muted-foreground">{yLabel}</div>
      )}
    </div>
  );
};
