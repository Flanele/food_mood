import { cn } from "@/shared/lib/utils";
import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type CorrelationPoint = {
  name: string;
  value: number;
};

interface Props {
  className?: string;
  data: CorrelationPoint[];
}

const getBarColor = (value: number) => {
  if (value <= -0.5) return "#EF4444"; // red-500
  if (value < 0) return "#FCA5A5"; // rose-300
  if (value < 0.5) return "#86EFAC"; // green-300
  return "#00C950"; // primary
};

export const NutrientsScoreBarChart: React.FC<Props> = ({
  className,
  data,
}) => {
  const isEmpty = !data || data.length === 0;

  return (
    <div className={cn(className)}>
      <div className="relative h-[250px] w-full">
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-sm"
              style={{ backgroundColor: "#EF4444" }}
            />
            <span>Strong negative (≤ -0.5)</span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-sm"
              style={{ backgroundColor: "#FCA5A5" }}
            />
            <span>Weak negative (-0.5 to 0)</span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-sm"
              style={{ backgroundColor: "#86EFAC" }}
            />
            <span>Weak positive (0 to 0.5)</span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-sm"
              style={{ backgroundColor: "#00C950" }}
            />
            <span>Strong positive (≥ 0.5)</span>
          </div>
        </div>
        
        <ResponsiveContainer>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 12, right: 16, bottom: 8, left: 16 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[-1, 1]} />
            <YAxis type="category" dataKey="name" width={80} />
            <Tooltip cursor={{ fill: "#F5F6FA", opacity: 0.8 }} />
            <ReferenceLine x={0} stroke="#9CA3AF" /> {/* ноль по центру */}
            <Bar dataKey="value">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.value)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {isEmpty && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="rounded-md border bg-white/90 px-3 py-2 text-sm text-gray-500 shadow">
              No data
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
