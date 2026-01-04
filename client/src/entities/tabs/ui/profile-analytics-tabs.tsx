import React from "react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { AnalyticsTab } from "../model/use-profile-analytics-tabs";

interface Props {
  className?: string;
  value: AnalyticsTab;
  onChange: (tab: AnalyticsTab) => void;
}

export const ProfileAnalyticsTabs: React.FC<Props> = ({
  className,
  value,
  onChange,
}) => {
  return (
    <div className={cn(className, "flex flex-wrap gap-5")}>
      <Button
        type="button"
        variant={value === "by-time" ? "secondary" : "ghost"}
        onClick={() => onChange("by-time")}
      >
        By time
      </Button>

      <Button
        type="button"
        variant={value === "by-ingredients" ? "secondary" : "ghost"}
        onClick={() => onChange("by-ingredients")}
      >
        By ingredients
      </Button>

      <Button
        type="button"
        variant={value === "nutrients-score" ? "secondary" : "ghost"}
        onClick={() => onChange("nutrients-score")}
      >
        Nutrients score
      </Button>
    </div>
  );
};
