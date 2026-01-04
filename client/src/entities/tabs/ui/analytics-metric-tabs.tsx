import React from "react";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import { Metric } from "@/shared";

interface Props {
  className?: string;
  value: Metric;
  onChange: (metric: Metric) => void;
}

export const AnalyticsMetricTabs: React.FC<Props> = ({
  className,
  value,
  onChange,
}) => {
  return (
    <div className={cn(className, "flex flex-wrap gap-2")}>
      <Button
        type="button"
        variant={value === "kcal" ? "secondary" : "ghost"}
        onClick={() => onChange("kcal")}
      >
        kcal
      </Button>

      <Button
        type="button"
        variant={value === "prot" ? "secondary" : "ghost"}
        onClick={() => onChange("prot")}
      >
        prot
      </Button>

      <Button
        type="button"
        variant={value === "fat" ? "secondary" : "ghost"}
        onClick={() => onChange("fat")}
      >
        fat
      </Button>

      <Button
        type="button"
        variant={value === "carb" ? "secondary" : "ghost"}
        onClick={() => onChange("carb")}
      >
        carb
      </Button>

      <Button
        type="button"
        variant={value === "sugar" ? "secondary" : "ghost"}
        onClick={() => onChange("sugar")}
      >
        sugar
      </Button>
    </div>
  );
};
