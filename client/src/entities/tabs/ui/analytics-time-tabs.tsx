import React from "react";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import { GroupByTab } from "../model/use-analytics-group-by-time-tabs";

interface Props {
  className?: string;
  value: GroupByTab;
  onChange: (value: GroupByTab) => void;
  onResetCustomRange: () => void;
}

export const AnalyticsTimeTabs: React.FC<Props> = ({
  className,
  value,
  onChange,
  onResetCustomRange,
}) => {
  return (
    <div className={cn(className, "flex flex-wrap gap-4")}>
      <Button
        type="button"
        variant={value === "last-24h" ? "secondary" : "ghost"}
        onClick={() => {
          onChange("last-24h");
          onResetCustomRange();
        }}
      >
        Last 24h
      </Button>

      <Button
        type="button"
        variant={value === "last-7d" ? "secondary" : "ghost"}
        onClick={() => {
          onChange("last-7d");
          onResetCustomRange();
        }}
      >
        Last 7 days
      </Button>

      <Button
        type="button"
        variant={value === "last-30d" ? "secondary" : "ghost"}
        onClick={() => {
          onChange("last-30d");
          onResetCustomRange();
        }}
      >
        Last 30 days
      </Button>

      <Button
        type="button"
        variant={value === "custom-period" ? "secondary" : "ghost"}
        onClick={() => onChange("custom-period")}
      >
        Custom period
      </Button>
    </div>
  );
};
